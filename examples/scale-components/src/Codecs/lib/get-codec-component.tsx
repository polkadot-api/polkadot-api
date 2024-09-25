import { V15, V14, HexString, Encoder } from "@polkadot-api/substrate-bindings"
import {
  getDynamicBuilder,
  getLookupFn,
  LookupEntry,
  MetadataLookup,
  Var,
} from "@polkadot-api/metadata-builders"
import React, { FC, useMemo, useRef } from "react"
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
  const baseComponents = _baseComponents as EditComponents
  const CodecComponent: React.FC<{
    dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    entry: LookupEntry
    value:
      | {
          empty: true
        }
      | { empty: false; decoded: any; encoded?: Uint8Array }
  }> = ({ entry, value, dynCodecs }) => {
    // console.log(value)
    const valueProps = value.empty
      ? { value: NOTIN as NOTIN }
      : {
          value: value.decoded,
          encodedValue:
            value.encoded || withNotin(dynCodecs(entry.id).enc)(value.decoded),
        }
    // console.log(valueProps)

    if (entry.type === "struct") {
      const Inner = baseComponents.CStruct
      return (
        <Inner
          {...{
            ...valueProps,
            shape: entry,
            innerComponents: mapObject(entry.value, (entry, key) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry}
                value={
                  value.empty
                    ? value
                    : value.decoded[key] === NOTIN
                      ? { empty: true }
                      : {
                          empty: false,
                          decoded: value.decoded[key],
                        }
                }
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "tuple") {
      const Inner = baseComponents.CTuple
      return (
        <Inner
          {...{
            ...valueProps,
            shape: entry,
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
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
        if (innerEntry.type === "lookupEntry")
          innerEntry = innerEntry.value as any
      }
      const Inner = baseComponents.CEnum
      return (
        <Inner
          {...{
            ...valueProps,
            onChange: () => {},
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={innerEntry}
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
      const Inner = baseComponents.CResult
      return (
        <Inner
          {...{
            ...valueProps,
            onChange: () => {},
            shape: entry,
            inner: value.empty ? null : (
              <CodecComponent
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
      const Inner = baseComponents.COption
      return (
        <Inner
          {...{
            ...valueProps,
            shape: entry,
            onChange: () => {},
            inner:
              value.empty || value.decoded === undefined ? (
                <baseComponents.CVoid />
              ) : (
                <CodecComponent
                  dynCodecs={dynCodecs}
                  entry={entry.value}
                  value={
                    value.decoded === NOTIN
                      ? { empty: true }
                      : { empty: false, decoded: value.decoded }
                  }
                />
              ),
          }}
        />
      )
    }

    if (entry.type === "void") return <baseComponents.CVoid />

    if (entry.type === "array") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return (
          <baseComponents.CBytes
            onBinChanged={() => {}}
            onValueChanged={() => {}}
            len={entry.len}
            {...valueProps}
          />
        )
      }

      const Inner = baseComponents.CArray
      return (
        <Inner
          {...{
            ...valueProps,
            shape: entry,
            onReorder: () => {},
            innerComponents: (value.empty
              ? Array(entry.len).fill(NOTIN)
              : (value.decoded as Array<any>)
            ).map((decoded) => (
              <CodecComponent
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

    if (entry.type === "sequence") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return (
          <baseComponents.CBytes
            {...valueProps}
            onBinChanged={() => {}}
            onValueChanged={() => {}}
          />
        )
      }

      const Inner = baseComponents.CSequence
      return (
        <Inner
          {...{
            ...valueProps,
            shape: entry,
            onReorder: () => {},
            onAddItem: () => {},
            onDeleteItem: () => {},
            innerComponents: (value.empty
              ? []
              : (value.decoded as Array<any>)
            ).map((decoded) => (
              <CodecComponent
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
      | EditBigNumber
      | EditNumber
      | EditBool
      | EditStr
      | EditAccountId
      | EditEthAccount = null as any

    switch (entry.type) {
      case "compact": {
        ResultComponent = entry.isBig
          ? baseComponents.CBigNumber
          : baseComponents.CNumber
        type = entry.isBig ? "compactBn" : "compactNumber"
        break
      }
      case "primitive": {
        if (entry.value === "str" || entry.value === "char")
          ResultComponent = baseComponents.CStr
        else if (entry.value === "bool") ResultComponent = baseComponents.CBool
        else {
          const nBits = Number(entry.value.slice(1))
          ResultComponent =
            nBits < 64 ? baseComponents.CNumber : baseComponents.CBigNumber
          type = entry.value
        }
        break
      }
      case "bitSequence": {
        return null
      }
      case "AccountId32": {
        ResultComponent = baseComponents.CAccountId
        break
      }
      case "AccountId20": {
        ResultComponent = baseComponents.CEthAccount
        break
      }
    }

    const Foo = ResultComponent as FC<any>
    return (
      <Foo
        {...valueProps}
        onBinChanged={() => {}}
        onValueChanged={() => {}}
        type={type}
      />
    )
  }

  const result: FC<{
    metadata: V14 | V15
    codecType: number
    value?: Uint8Array | HexString
  }> = ({ metadata, codecType, value }) => {
    const lookupRef = useRef<{
      metadata: V14 | V15
      lookup: MetadataLookup
      dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    }>({
      metadata: null as any,
      lookup: null as any,
      dynCodecs: null as any,
    })

    if (lookupRef.current.metadata !== metadata) {
      const lookup = getLookupFn(metadata)

      lookupRef.current = {
        metadata,
        lookup,
        dynCodecs: getDynamicBuilder(lookup).buildDefinition,
      }
    }
    const decoded = useMemo(
      () => (value ? lookupRef.current.dynCodecs(codecType).dec(value) : NOTIN),
      [value, codecType, metadata],
    )

    return (
      <CodecComponent
        {...{
          dynCodecs: lookupRef.current.dynCodecs,
          entry: lookupRef.current.lookup(codecType),
          value: value
            ? {
                empty: false,
                decoded,
                encoded: typeof value === "string" ? fromHex(value) : value,
              }
            : { empty: true },
        }}
      />
    )
  }

  return result as any
}
