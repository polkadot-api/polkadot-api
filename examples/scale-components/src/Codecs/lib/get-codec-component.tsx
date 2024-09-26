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
import React, { FC, useEffect, useRef, useState } from "react"
import { fromHex, mapObject, mergeUint8 } from "@polkadot-api/utils"
import type {
  EditAccountId,
  EditBigNumber,
  EditBool,
  EditComponents,
  EditEthAccount,
  EditNumber,
  EditStr,
  ViewComponents,
} from "./types"
import { NOTIN } from "./types"

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

export function getCodecComponent(baseComponent: ViewComponents): React.FC<{
  metadata: V14 | V15
  codecType: number
  value: Uint8Array | HexString
}>
export function getCodecComponent(baseComponent: EditComponents): React.FC<{
  metadata: V14 | V15
  codecType: number
  value?: Uint8Array | HexString
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
    dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    entry: LookupEntry
    parent?: { id: number; variantIdx: number; variantTag: string }
    value:
      | {
          empty: true
        }
      | { empty: false; decoded: any; encoded?: Uint8Array }
    onChange: (value: any) => boolean
  }> = ({ entry, value, dynCodecs, onChange, parent }) => {
    const codec =
      "id" in entry
        ? dynCodecs(entry.id)
        : getInnerEnumCodec(
            dynCodecs(parent!.id),
            parent!.variantIdx,
            parent!.variantTag,
          )

    const createOnBinChanged =
      (decoder: scale.Decoder<any>) =>
      (x: any): boolean => {
        let decoded
        try {
          decoded = decoder(x)
        } catch (e) {
          console.warn("error decoding", x, entry)
          return false
        }
        return onChange(decoded)
      }
    const onBinChanged = createOnBinChanged(codec.dec)
    let valueProps:
      | { type: "blank"; value: NOTIN; encodedValue: undefined }
      | { type: "partial"; value: any; encodedValue: undefined }
      | { type: "complete"; value: any; encodedValue: Uint8Array } = {
      type: "blank" as "blank",
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
          shape={entry}
          onBinChanged={onBinChanged}
          onValueChanged={onChange}
          innerComponents={mapObject(entry.value, (entry, key) => (
            <CodecComponent
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
            onBinChanged,
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
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
        if (innerEntry.type === "lookupEntry")
          innerEntry = innerEntry.value as any
      }

      return (
        <CEnum
          {...{
            ...valueProps,
            onBinChanged,
            onValueChanged: onChange,
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={innerEntry}
                onChange={(x) =>
                  onChange({ type: value.decoded.type, value: x })
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
            onBinChanged,
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
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
            shape: entry,
            onValueChanged: onChange,
            onBinChanged,
            inner:
              !value.empty && value.decoded === undefined ? (
                <CVoid />
              ) : (
                <CodecComponent
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
            onBinChanged={createOnBinChanged(decoder)}
            onValueChanged={onChange}
            len={entry.len}
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
            shape: entry,
            onBinChanged,
            onValueChanged: onChange,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
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

    if (entry.type === "sequence") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        const decoder = Bytes()[1]
        return (
          <CBytes
            {...(valueProps as any)}
            onBinChanged={createOnBinChanged(decoder)}
            onValueChanged={onChange}
          />
        )
      }

      const latestValue = value.empty ? [] : (value.decoded as Array<any>)
      return (
        <CSequence
          {...{
            ...valueProps,
            shape: entry,
            onValueChanged: onChange,
            onBinChanged,
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
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
        type = entry.isBig ? "compactBn" : "compactNumber"
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

    const Foo = ResultComponent as FC<any>
    return (
      <Foo
        {...valueProps}
        onBinChanged={onBinChanged}
        onValueChanged={onChange}
        numType={type}
      />
    )
  }

  const result: FC<{
    metadata: V14 | V15
    codecType: number
    value?: Uint8Array | HexString
  }> = ({ metadata, codecType, value: initialValue }) => {
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
        refresh: (codecType, val) =>
          val
            ? {
                empty: false,
                decoded: lookupRef.current.dynCodecs(codecType).dec(val),
                encoded: typeof val === "string" ? fromHex(val) : val,
              }
            : { empty: true },
      }
    }

    const [value, setValue] = useState<
      { empty: true } | { empty: false; decoded: any; encoded?: Uint8Array }
    >(() => lookupRef.current.refresh(codecType, initialValue))

    useEffect(() => {
      setValue(lookupRef.current.refresh(codecType, initialValue))
    }, [codecType, initialValue])

    return (
      <CodecComponent
        onChange={(x) => {
          if (x === NOTIN) {
            setValue({ empty: true })
            return true
          }

          let encoded = undefined
          const hasNotin = detectNotin(x)
          if (!hasNotin) {
            try {
              encoded = lookupRef.current.dynCodecs(codecType).enc(x)
            } catch (e) {
              console.warn("Error encoding", x)
              return false
            }
          }
          setValue({ empty: false, decoded: x, encoded })
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
