/* eslint-disable react-hooks/rules-of-hooks */
import {
  V15,
  V14,
  HexString,
  Encoder,
  Bytes,
} from "@polkadot-api/substrate-bindings"
import * as scale from "@polkadot-api/substrate-bindings"
import {
  getDynamicBuilder,
  getLookupFn,
  LookupEntry,
  MetadataLookup,
  Var,
} from "@polkadot-api/metadata-builders"
import React, { FC, useRef } from "react"
import { fromHex, mapObject, mergeUint8 } from "@polkadot-api/utils"
import type {
  EditAccountId,
  EditBigNumber,
  EditBool,
  EditComponents,
  EditEthAccount,
  EditNumber,
  EditStr,
  ViewAccountId,
  ViewBigNumber,
  ViewBool,
  ViewComponents,
  ViewEthAccount,
  ViewNumber,
  ViewStr,
} from "./types"
import { NOTIN } from "./types"

export type MetadataType = V14 | V15

export const enum CodecComponentType {
  Initial,
  Updated,
}

export type CodecComponentUpdate =
  | { empty: true }
  | { empty: false; decoded: any; encoded?: Uint8Array }
export type CodecComponentValue =
  | { type: CodecComponentType.Initial; value?: Uint8Array | HexString }
  | { type: CodecComponentType.Updated; value: CodecComponentUpdate }

export type LookupType = Var["type"]

const detectNotin: <T>(x: T) => boolean = (x) => {
  if (x === NOTIN) return true
  return x != null && typeof x === "object"
    ? Object.values(x).some(detectNotin)
    : false
}

const withNotin: <T>(
  encoder: Encoder<T>,
) => (input: T) => Uint8Array | undefined = (encoder) => (input) =>
  detectNotin(input) ? undefined : encoder(input)

const getInnerEnumCodec = (
  input: scale.Codec<{ type: string; value: any }>,
  idx: number,
  type: string,
) => {
  return scale.createCodec(
    (value: any) => input.enc({ type, value }).slice(1),
    (value) => {
      const val: Uint8Array =
        value instanceof Uint8Array
          ? value
          : typeof value === "string"
            ? fromHex(value)
            : new Uint8Array(value)
      return input.dec(mergeUint8(new Uint8Array([idx]), val)).value
    },
  )
}

export function getViewCodecComponent(
  baseComponents: ViewComponents,
): React.FC<{
  metadata: MetadataType
  codecType: number
  value: Uint8Array | HexString
}> {
  const {
    CVoid,
    CAccountId,
    CBigNumber,
    CNumber,
    CBool,
    CStr,
    CBytes,
    CEthAccount,
    CEnum,
    CSequence,
    CArray,
    CTuple,
    CStruct,
    COption,
    CResult,
  } = baseComponents as ViewComponents

  const CodecComponent: React.FC<{
    path: string[]
    dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    entry: LookupEntry
    parent?: { id: number; variantIdx: number; variantTag: string }
    value:
      | {
          empty: true
        }
      | { empty: false; decoded: any; encoded?: Uint8Array }
  }> = ({ entry, value, dynCodecs, parent, path }) => {
    if (value.empty) return <></>

    const codec =
      "id" in entry
        ? dynCodecs(entry.id)
        : getInnerEnumCodec(
            dynCodecs(parent!.id),
            parent!.variantIdx,
            parent!.variantTag,
          )

    const encodedValue = value.encoded || codec.enc(value.decoded)
    const valueProps = { value: value.decoded, encodedValue: encodedValue }

    if (entry.type === "struct") {
      const latestValue = value.decoded
      return (
        <CStruct
          {...valueProps}
          shape={entry}
          path={path}
          innerComponents={mapObject(entry.value, (entry, key) => (
            <CodecComponent
              path={path.concat(key as string)}
              dynCodecs={dynCodecs}
              entry={entry}
              value={
                latestValue[key] === NOTIN
                  ? { empty: true }
                  : {
                      empty: false,
                      decoded: latestValue[key],
                    }
              }
            />
          ))}
        />
      )
    }

    if (entry.type === "tuple") {
      return (
        <CTuple
          {...{
            ...valueProps,
            shape: entry,
            path,
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
                path={path.concat(idx.toString())}
                dynCodecs={dynCodecs}
                entry={entry}
                value={
                  value.empty
                    ? value
                    : value.decoded[idx] === NOTIN
                      ? { empty: true }
                      : {
                          empty: false,
                          decoded: value.decoded[idx],
                        }
                }
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "enum") {
      let innerEntry
      if (!value.empty) {
        innerEntry = entry.value[value.decoded.type as string]
        if (innerEntry?.type === "lookupEntry")
          innerEntry = innerEntry.value as any
        if (!innerEntry) return null
      }
      return (
        <CEnum
          {...{
            ...valueProps,
            path,
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                path={path.concat(value.decoded.type)}
                dynCodecs={dynCodecs}
                entry={innerEntry}
                parent={{
                  id: entry.id,
                  variantTag: value.decoded.type,
                  variantIdx:
                    entry.value[value.decoded.type as keyof typeof entry.value]
                      .idx,
                }}
                value={
                  value.decoded.value === NOTIN
                    ? { empty: true }
                    : {
                        empty: false,
                        decoded: value.decoded.value,
                        encoded:
                          (valueProps as any).encodedValue &&
                          (valueProps as any).encodedValue.slice(1),
                      }
                }
              />
            ),
          }}
        />
      )
    }

    if (entry.type === "result") {
      return (
        <CResult
          {...{
            ...valueProps,
            path,
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                path={path.concat(
                  `Result(${value.decoded.success ? "Success" : "Failure"})`,
                )}
                dynCodecs={dynCodecs}
                entry={entry.value[value.decoded.success ? "ok" : "ko"]}
                value={
                  value.decoded.value === NOTIN
                    ? { empty: true }
                    : {
                        empty: false,
                        decoded: value.decoded.value,
                      }
                }
              />
            ),
          }}
        />
      )
    }

    if (entry.type === "option") {
      return (
        <COption
          {...{
            ...valueProps,
            path,
            shape: entry,
            inner:
              !value.empty && value.decoded === undefined ? (
                <CVoid />
              ) : (
                <CodecComponent
                  path={path.concat(
                    `Option(${value.empty ? "Void" : value.decoded === NOTIN ? "" : "Value"})`,
                  )}
                  dynCodecs={dynCodecs}
                  entry={entry.value}
                  value={
                    value.empty || value.decoded === NOTIN
                      ? { empty: true }
                      : {
                          empty: false,
                          decoded: value.decoded,
                        }
                  }
                />
              ),
          }}
        />
      )
    }

    if (entry.type === "void") return <CVoid />

    if (entry.type === "array") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return <CBytes len={entry.len} path={path} {...(valueProps as any)} />
      }

      const latestValue = value.empty
        ? Array(entry.len).fill(NOTIN)
        : (value.decoded as Array<any>)
      return (
        <CArray
          {...{
            ...valueProps,
            path,
            shape: entry,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                path={path.concat(idx.toString())}
                value={
                  decoded === NOTIN
                    ? { empty: true }
                    : { empty: false, decoded }
                }
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "sequence") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return <CBytes {...(valueProps as any)} path={path} />
      }

      const latestValue = value.empty ? [] : (value.decoded as Array<any>)
      return (
        <CSequence
          {...{
            ...valueProps,
            path,
            shape: entry,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                path={path.concat(idx.toString())}
                dynCodecs={dynCodecs}
                entry={entry.value}
                value={
                  decoded === NOTIN
                    ? { empty: true }
                    : { empty: false, decoded }
                }
              />
            )),
          }}
        />
      )
    }

    let type: any = undefined
    let ResultComponent:
      | ViewBigNumber
      | ViewNumber
      | ViewBool
      | ViewStr
      | ViewAccountId
      | ViewEthAccount = null as any

    switch (entry.type) {
      case "compact": {
        ResultComponent = entry.isBig ? CBigNumber : CNumber
        type = entry.size
        break
      }
      case "primitive": {
        if (entry.value === "str" || entry.value === "char")
          ResultComponent = CStr
        else if (entry.value === "bool") ResultComponent = CBool
        else {
          const nBits = Number(entry.value.slice(1))
          ResultComponent = nBits < 64 ? CNumber : CBigNumber
          type = entry.value
        }
        break
      }
      case "bitSequence": {
        return null
      }
      case "AccountId32": {
        ResultComponent = CAccountId
        break
      }
      case "AccountId20": {
        ResultComponent = CEthAccount
        break
      }
    }

    const Result = ResultComponent as FC<any>
    return <Result {...valueProps} path={path} numType={type} />
  }

  const result: FC<{
    metadata: V14 | V15
    codecType: number
    value: Uint8Array | HexString
  }> = ({ metadata, codecType, value: propsValue }) => {
    const lookupRef = useRef<{
      metadata: V14 | V15
      lookup: MetadataLookup
      dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
      refresh: (
        codecType: number,
        value: Uint8Array | HexString,
      ) => { empty: true } | { empty: false; decoded: any; encoded: Uint8Array }
    }>({
      metadata: null as any,
      lookup: null as any,
      dynCodecs: null as any,
      refresh: () => ({ empty: true }),
    })

    if (lookupRef.current.metadata !== metadata) {
      const lookup = getLookupFn(metadata)
      lookupRef.current = {
        metadata,
        lookup,
        dynCodecs: getDynamicBuilder(lookup).buildDefinition,
        refresh: (codecType, val) => {
          try {
            const decoded = lookupRef.current.dynCodecs(codecType).dec(val)
            return {
              empty: false,
              decoded,
              encoded: typeof val === "string" ? fromHex(val) : val,
            }
          } catch (_error) {
            console.error("invalid hex for the codec")
            return { empty: true }
          }
        },
      }
    }

    const value = lookupRef.current.refresh(codecType, propsValue)

    return (
      <CodecComponent
        path={[]}
        {...{
          dynCodecs: lookupRef.current.dynCodecs,
          entry: lookupRef.current.lookup(codecType),
          value: value,
        }}
      />
    )
  }

  return result as any
}

export function getCodecComponent(baseComponent: ViewComponents): React.FC<{
  metadata: V14 | V15
  codecType: number
  value: CodecComponentValue
}>
export function getCodecComponent(baseComponent: EditComponents): React.FC<{
  metadata: V14 | V15
  codecType: number
  value: CodecComponentValue
  onUpdate?: (newValue: CodecComponentUpdate) => void
}>
export function getCodecComponent(
  _baseComponents: EditComponents | ViewComponents,
) {
  const {
    CVoid,
    CAccountId,
    CBigNumber,
    CNumber,
    CBool,
    CStr,
    CBytes,
    CEthAccount,
    CEnum,
    CSequence,
    CArray,
    CTuple,
    CStruct,
    COption,
    CResult,
  } = _baseComponents as EditComponents
  const CodecComponent: React.FC<{
    path: string[]
    dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    entry: LookupEntry
    parent?: { id: number; variantIdx: number; variantTag: string }
    value:
      | {
          empty: true
        }
      | { empty: false; decoded: any; encoded?: Uint8Array }
    onChange: (value: any) => boolean
  }> = ({ entry, value, dynCodecs, onChange, parent, path }) => {
    const codec =
      "id" in entry
        ? dynCodecs(entry.id)
        : getInnerEnumCodec(
            dynCodecs(parent!.id),
            parent!.variantIdx,
            parent!.variantTag,
          )

    const createDecode = (decoder: scale.Decoder<any>) =>
      scale.createDecoder((bytes) => {
        try {
          const result = decoder(bytes)
          return bytes.length === (bytes as Uint8Array & { i: number }).i
            ? result
            : NOTIN
        } catch {
          return NOTIN
        }
      })
    const decode = createDecode(codec.dec)

    let valueProps:
      | { type: "blank"; value: NOTIN; encodedValue: undefined }
      | { type: "partial"; value: any; encodedValue: undefined }
      | { type: "complete"; value: any; encodedValue: Uint8Array } = {
      type: "blank" as const,
      value: NOTIN,
      encodedValue: undefined,
    }
    if (!value.empty) {
      const encodedValue = value.encoded || withNotin(codec.enc)(value.decoded)
      valueProps = encodedValue
        ? { type: "complete", value: value.decoded, encodedValue }
        : { type: "partial", value: value.decoded, encodedValue: undefined }
    }

    if (entry.type === "struct") {
      const latestValue = value.empty
        ? mapObject(entry.value, () => NOTIN)
        : value.decoded
      return (
        <CStruct
          {...valueProps}
          decode={decode}
          shape={entry}
          onValueChanged={onChange}
          path={path}
          innerComponents={mapObject(entry.value, (entry, key) => (
            <CodecComponent
              path={path.concat(key as string)}
              dynCodecs={dynCodecs}
              entry={entry}
              onChange={(x) => {
                const value = { ...latestValue }
                value[key] = x
                return onChange(value)
              }}
              value={
                latestValue[key] === NOTIN
                  ? { empty: true }
                  : {
                      empty: false,
                      decoded: latestValue[key],
                    }
              }
            />
          ))}
        />
      )
    }

    if (entry.type === "tuple") {
      const latestValue = value.empty
        ? entry.value.map(() => NOTIN)
        : value.decoded
      return (
        <CTuple
          {...{
            ...valueProps,
            shape: entry,
            onValueChanged: onChange,
            decode,
            path,
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
                path={path.concat(idx.toString())}
                dynCodecs={dynCodecs}
                entry={entry}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  return onChange(value)
                }}
                value={
                  value.empty
                    ? value
                    : value.decoded[idx] === NOTIN
                      ? { empty: true }
                      : {
                          empty: false,
                          decoded: value.decoded[idx],
                        }
                }
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "enum") {
      let innerEntry
      if (!value.empty) {
        innerEntry = entry.value[value.decoded.type as string]
        if (innerEntry?.type === "lookupEntry")
          innerEntry = innerEntry.value as any
        if (!innerEntry) {
          valueProps = { type: "blank", value: NOTIN, encodedValue: undefined }
          value = { empty: true }
        }
      }
      return (
        <CEnum
          {...{
            ...valueProps,
            decode,
            onValueChanged: onChange,
            path,
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                path={path.concat(value.decoded.type)}
                dynCodecs={dynCodecs}
                entry={innerEntry}
                onChange={(x) =>
                  onChange({ type: (value as any).decoded.type, value: x })
                }
                parent={{
                  id: entry.id,
                  variantTag: value.decoded.type,
                  variantIdx:
                    entry.value[value.decoded.type as keyof typeof entry.value]
                      .idx,
                }}
                value={
                  value.decoded.value === NOTIN
                    ? { empty: true }
                    : {
                        empty: false,
                        decoded: value.decoded.value,
                        encoded:
                          (valueProps as any).encodedValue &&
                          (valueProps as any).encodedValue.slice(1),
                      }
                }
              />
            ),
          }}
        />
      )
    }

    if (entry.type === "result") {
      return (
        <CResult
          {...{
            ...valueProps,
            onValueChanged: onChange,
            path,
            decode,
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                path={path.concat(
                  `Result(${value.decoded.success ? "Success" : "Failure"})`,
                )}
                onChange={(x) =>
                  onChange({ success: value.decoded.success, value: x })
                }
                dynCodecs={dynCodecs}
                entry={entry.value[value.decoded.success ? "ok" : "ko"]}
                value={
                  value.decoded.value === NOTIN
                    ? { empty: true }
                    : { empty: false, decoded: value.decoded.value }
                }
              />
            ),
          }}
        />
      )
    }

    if (entry.type === "option") {
      return (
        <COption
          {...{
            ...valueProps,
            path,
            shape: entry,
            onValueChanged: onChange,
            decode,
            inner:
              !value.empty && value.decoded === undefined ? (
                <CVoid />
              ) : (
                <CodecComponent
                  path={path.concat(
                    `Option(${value.empty ? "Void" : value.decoded === NOTIN ? "" : "Value"})`,
                  )}
                  dynCodecs={dynCodecs}
                  entry={entry.value}
                  onChange={onChange}
                  value={
                    value.empty || value.decoded === NOTIN
                      ? { empty: true }
                      : { empty: false, decoded: value.decoded }
                  }
                />
              ),
          }}
        />
      )
    }

    if (entry.type === "void") return <CVoid />

    if (entry.type === "array") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        const decoder = Bytes(entry.len)[1]
        return (
          <CBytes
            decode={scale.createDecoder(decoder)}
            onValueChanged={onChange}
            len={entry.len}
            path={path}
            {...(valueProps as any)}
          />
        )
      }

      const latestValue = value.empty
        ? Array(entry.len).fill(NOTIN)
        : (value.decoded as Array<any>)
      return (
        <CArray
          {...{
            ...valueProps,
            path,
            shape: entry,
            decode,
            onValueChanged: onChange,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                path={path.concat(idx.toString())}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  return onChange(value)
                }}
                value={
                  decoded === NOTIN
                    ? { empty: true }
                    : { empty: false, decoded }
                }
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "sequence") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        const decoder = Bytes()[1]
        return (
          <CBytes
            {...(valueProps as any)}
            path={path}
            decode={createDecode(decoder)}
            onValueChanged={onChange}
          />
        )
      }

      const latestValue = value.empty ? [] : (value.decoded as Array<any>)
      return (
        <CSequence
          {...{
            ...valueProps,
            path,
            shape: entry,
            onValueChanged: onChange,
            decode,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                path={path.concat(idx.toString())}
                dynCodecs={dynCodecs}
                entry={entry.value}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  return onChange(value)
                }}
                value={
                  decoded === NOTIN
                    ? { empty: true }
                    : { empty: false, decoded }
                }
              />
            )),
          }}
        />
      )
    }

    let type: any = undefined
    let ResultComponent:
      | EditBigNumber
      | EditNumber
      | EditBool
      | EditStr
      | EditAccountId
      | EditEthAccount = null as any

    switch (entry.type) {
      case "compact": {
        ResultComponent = entry.isBig ? CBigNumber : CNumber
        type = entry.size
        break
      }
      case "primitive": {
        if (entry.value === "str" || entry.value === "char")
          ResultComponent = CStr
        else if (entry.value === "bool") ResultComponent = CBool
        else {
          const nBits = Number(entry.value.slice(1))
          ResultComponent = nBits < 64 ? CNumber : CBigNumber
          type = entry.value
        }
        break
      }
      case "bitSequence": {
        return null
      }
      case "AccountId32": {
        ResultComponent = CAccountId
        break
      }
      case "AccountId20": {
        ResultComponent = CEthAccount
        break
      }
    }

    const Result = ResultComponent as FC<any>
    return (
      <Result
        {...valueProps}
        path={path}
        decode={decode}
        onValueChanged={onChange}
        numType={type}
      />
    )
  }

  const result: FC<{
    metadata: V14 | V15
    codecType: number
    value: CodecComponentValue
    onUpdate: (newValue: CodecComponentUpdate) => void
  }> = ({ metadata, codecType, value: propsValue, onUpdate }) => {
    const lookupRef = useRef<{
      metadata: V14 | V15
      lookup: MetadataLookup
      dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
      refresh: (
        codecType: number,
        value?: Uint8Array | HexString,
      ) =>
        | { empty: true }
        | { empty: false; decoded: any; encoded?: Uint8Array }
    }>({
      metadata: null as any,
      lookup: null as any,
      dynCodecs: null as any,
      refresh: () => ({ empty: true }),
    })

    if (lookupRef.current.metadata !== metadata) {
      const lookup = getLookupFn(metadata)
      lookupRef.current = {
        metadata,
        lookup,
        dynCodecs: getDynamicBuilder(lookup).buildDefinition,
        refresh: (codecType, val) => {
          try {
            return val
              ? {
                  empty: false,
                  decoded: lookupRef.current.dynCodecs(codecType).dec(val),
                  encoded: typeof val === "string" ? fromHex(val) : val,
                }
              : { empty: true }
          } catch (_error) {
            console.error("invalid hex for the codec")
            return { empty: true }
          }
        },
      }
    }

    const value =
      propsValue.type === CodecComponentType.Initial
        ? lookupRef.current.refresh(codecType, propsValue.value)
        : propsValue.value

    return (
      <CodecComponent
        path={[]}
        onChange={(x) => {
          if (x === NOTIN) {
            onUpdate({ empty: true })
            return true
          }

          let encoded = undefined
          const hasNotin = detectNotin(x)
          if (!hasNotin) {
            try {
              encoded = lookupRef.current.dynCodecs(codecType).enc(x)
            } catch (_e) {
              console.warn("Error encoding", x)
              return false
            }
          }
          onUpdate({ empty: false, decoded: x, encoded })
          return true
        }}
        {...{
          dynCodecs: lookupRef.current.dynCodecs,
          entry: lookupRef.current.lookup(codecType),
          value: value,
        }}
      />
    )
  }

  return result as any
}
