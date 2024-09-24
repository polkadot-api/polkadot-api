import { V15, V14, HexString } from "@polkadot-api/substrate-bindings"
import {
  getDynamicBuilder,
  getLookupFn,
  LookupEntry,
  MetadataLookup,
  Var,
} from "@polkadot-api/metadata-builders"
import React, { useMemo, useRef } from "react"
import * as _baseComponents from "./codec-components"
import {
  CEnum,
  CNumber,
  NumberInterface,
  CBNumber,
  BNumberInterface,
  CAccountId,
  AccountIdInterface,
} from "./components"
import { mapObject } from "@polkadot-api/utils"

export type LookupType = Var["type"]

export const getCodecComponent = (
  baseComponents: typeof _baseComponents,
): React.FC<{
  metadata: V14 | V15
  codecType: number
  value?: Uint8Array | HexString
}> => {
  const CodecComponent: React.FC<{
    dynCodecs: ReturnType<typeof getDynamicBuilder>["buildDefinition"]
    entry: LookupEntry
    decodedValue: any
    encodedValue?: Uint8Array
  }> = ({ entry, decodedValue, encodedValue, dynCodecs }) => {
    if (!encodedValue) encodedValue = dynCodecs(entry.id).enc(decodedValue)

    if (entry.type === "struct") {
      const Inner = baseComponents.CStruct
      return (
        <Inner
          {...{
            value: decodedValue,
            innerComponents: mapObject(entry.value, (entry, key) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry}
                decodedValue={decodedValue[key]}
              />
            )),
            encodedValue,
          }}
        />
      )
    }

    if (entry.type === "tuple") {
      const Inner = baseComponents.CTuple
      return (
        <Inner
          {...{
            value: decodedValue,
            innerComponents: entry.value.map((entry, idx) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry}
                decodedValue={decodedValue[idx]}
              />
            )),
            encodedValue,
          }}
        />
      )
    }

    if (entry.type === "enum") {
      let innerEntry = entry.value[decodedValue.type as string]
      if (innerEntry.type === "lookupEntry")
        innerEntry = innerEntry.value as any

      const innerEncoded = encodedValue.slice(1)

      const Inner = CEnum

      return (
        <Inner
          {...{
            value: decodedValue,
            encodedValue,
            onChange: () => {},
            tags: Object.entries(entry.value).map(([tag, { idx }]) => ({
              tag,
              idx,
            })),
            innerType: innerEntry.type as LookupType,
            inner: (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={innerEntry as any}
                decodedValue={decodedValue.value}
                encodedValue={innerEncoded}
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
            value: decodedValue,
            encodedValue,
            onChange: () => {},
            inner: (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value[decodedValue.success ? "ok" : "ko"]}
                decodedValue={decodedValue.value}
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
            value: decodedValue,
            encodedValue,
            onChange: () => {},
            inner:
              decodedValue === undefined ? (
                <baseComponents.CVoid />
              ) : (
                <CodecComponent
                  dynCodecs={dynCodecs}
                  entry={entry.value}
                  decodedValue={decodedValue}
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
          <_baseComponents.CBytes
            onBinChanged={() => {}}
            onValueChanged={() => {}}
            len={entry.len}
            encodedValue={encodedValue}
            value={decodedValue}
          />
        )
      }

      const Inner = baseComponents.CArray
      return (
        <Inner
          {...{
            value: decodedValue,
            encodedValue,
            onReorder: () => {},
            innerComponents: (decodedValue as Array<any>).map((iDecoded) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                decodedValue={iDecoded}
              />
            )),
          }}
        />
      )
    }

    if (entry.type === "sequence") {
      if (entry.value.type === "primitive" && entry.value.value === "u8") {
        return (
          <_baseComponents.CBytes
            onBinChanged={() => {}}
            onValueChanged={() => {}}
            encodedValue={encodedValue}
            value={decodedValue}
          />
        )
      }

      const Inner = baseComponents.CSequence
      return (
        <Inner
          {...{
            value: decodedValue,
            encodedValue,
            onReorder: () => {},
            onAddItem: () => {},
            onDeleteItem: () => {},
            innerComponents: (decodedValue as Array<any>).map((iDecoded) => (
              <CodecComponent
                dynCodecs={dynCodecs}
                entry={entry.value}
                decodedValue={iDecoded}
              />
            )),
          }}
        />
      )
    }

    let type: any = undefined
    let ResultComponent: React.FC<
      | NumberInterface
      | BNumberInterface
      | _baseComponents.BoolInterface
      | _baseComponents.StrInterface
      | AccountIdInterface
      | _baseComponents.EthAccountInterface
    > = null as any

    switch (entry.type) {
      case "compact": {
        ResultComponent = entry.isBig ? CBNumber : (CNumber as any)
        type = entry.isBig ? "compactBn" : "compactNumber"
        break
      }
      case "primitive": {
        if (entry.value === "str" || entry.value === "char")
          ResultComponent = _baseComponents.CString as any
        else if (entry.value === "bool")
          ResultComponent = _baseComponents.CBool as any
        else {
          const nBits = Number(entry.value.slice(1))
          ResultComponent = nBits < 64 ? CNumber : (CBNumber as any)
          type = entry.value
        }
        break
      }
      case "bitSequence": {
        return null
      }
      case "AccountId32": {
        ResultComponent = CAccountId as any
        break
      }
      case "AccountId20": {
        ResultComponent = _baseComponents.CEthAccount as any
        break
      }
    }

    return (
      <ResultComponent
        onBinChanged={() => {}}
        onValueChanged={() => {}}
        value={decodedValue}
        type={type}
        encodedValue={encodedValue}
      />
    )
  }

  return ({ metadata, codecType, value }) => {
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
      () => lookupRef.current.dynCodecs(codecType).dec(value!),
      [value, codecType, metadata],
    )

    console.log(decoded)

    return (
      <CodecComponent
        {...{
          dynCodecs: lookupRef.current.dynCodecs,
          decodedValue: decoded,
          entry: lookupRef.current.lookup(codecType),
        }}
      />
    )
  }
}
