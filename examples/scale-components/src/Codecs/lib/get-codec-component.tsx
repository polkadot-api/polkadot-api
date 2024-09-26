import {
  V15,
  V14,
  HexString,
  Encoder,
  Bytes,
  Decoder,
  compactBn,
  compactNumber,
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
import { fromHex, mapObject } from "@polkadot-api/utils"
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
    value:
      | {
          empty: true
        }
      | { empty: false; decoded: any; encoded?: Uint8Array }
    onChange: (value: any) => void
  }> = ({ entry, value, dynCodecs, onChange }) => {
    const valueProps = value.empty
      ? { value: NOTIN as NOTIN }
      : {
          value: value.decoded,
          encodedValue:
            value.encoded || withNotin(dynCodecs(entry.id).enc)(value.decoded),
        }

    if (entry.type === "struct") {
      const latestValue = value.empty
        ? mapObject(entry.value, () => NOTIN)
        : value.decoded
      return (
        <CStruct
          {...valueProps}
          shape={entry}
          innerComponents={mapObject(entry.value, (entry, key) => (
            <CodecComponent
              dynCodecs={dynCodecs}
              entry={entry}
              onChange={(x) => {
                const value = { ...latestValue }
                value[key] = x
                onChange(value)
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
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  onChange(value)
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
            onChange: (newTag) => {
              onChange({ type: newTag, value: NOTIN })
            },
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={innerEntry}
                onChange={(x) => {
                  onChange({ type: value.decoded.type, value: x })
                }}
                value={
                  value.decoded.value === NOTIN
                    ? { empty: true }
                    : {
                        empty: false,
                        decoded: value.decoded.value,
                        encoded:
                          valueProps.encodedValue &&
                          valueProps.encodedValue.slice(1),
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
            onChange: (x) => {
              onChange(
                typeof x === "boolean" ? { success: x, value: NOTIN } : x,
              )
            },
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                onChange={(x) => {
                  onChange({ success: value.decoded.success, value: x })
                }}
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
            onChange: (x) => {
              onChange(typeof x !== "boolean" ? x.value : x ? NOTIN : undefined)
            },
            inner:
              !value.empty && value.decoded === undefined ? (
                <CVoid />
              ) : (
                <CodecComponent
                  dynCodecs={dynCodecs}
                  entry={entry.value}
                  onChange={(x) => {
                    onChange(x)
                  }}
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
            onBinChanged={(v) => {
              onChange(decoder(v))
            }}
            onValueChanged={onChange}
            len={entry.len}
            {...valueProps}
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
            onReorder: (prevIdx, newIdx) => {
              const value = [...latestValue]
              value.splice(newIdx, 0, value.splice(prevIdx, 1)[0])
              onChange(value)
            },
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  onChange(value)
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
            {...valueProps}
            onBinChanged={(x) => {
              onChange(decoder(x))
            }}
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
            onReorder: (prevIdx, newIdx) => {
              const value = [...latestValue]
              value.splice(newIdx, 0, value.splice(prevIdx, 1)[0])
              onChange(value)
            },
            onAddItem: (x) => {
              onChange([...latestValue, x])
            },
            onDeleteItem: (idx) => {
              const value = [...latestValue]
              value.splice(idx, 1)
              onChange(value)
            },
            innerComponents: latestValue.map((decoded, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                onChange={(x) => {
                  const value = [...latestValue]
                  value[idx] = x
                  onChange(value)
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
    let decoder: Decoder<any> = null as any

    switch (entry.type) {
      case "compact": {
        ResultComponent = entry.isBig ? CBigNumber : CNumber
        type = entry.isBig ? "compactBn" : "compactNumber"
        decoder = (entry.isBig ? compactBn : compactNumber)[1]
        break
      }
      case "primitive": {
        decoder = scale[entry.value][1]
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
        decoder = scale.AccountId()[1]
        ResultComponent = CAccountId
        break
      }
      case "AccountId20": {
        decoder = scale.ethAccount[1]
        ResultComponent = CEthAccount
        break
      }
    }

    const Foo = ResultComponent as FC<any>
    return (
      <Foo
        {...valueProps}
        onBinChanged={(x: any) => {
          onChange(decoder(x))
        }}
        onValueChanged={onChange}
        type={type}
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
          const hasNotin = detectNotin(x)
          setValue(
            x === NOTIN
              ? { empty: true }
              : {
                  empty: false,
                  decoded: x,
                  encoded: hasNotin
                    ? undefined
                    : lookupRef.current.dynCodecs(codecType).enc(x),
                },
          )
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
