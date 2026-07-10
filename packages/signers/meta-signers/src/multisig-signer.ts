import { TxCreator } from "@polkadot-api/polkadot-signer"
import {
  AccountId,
  Blake2256,
  getMultisigAccountId,
  getSs58AddressInfo,
  HexString,
  SizedHex,
  sortMultisigSignatories,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { firstValueFrom, map } from "rxjs"
import { getCodecs } from "./get-codecs"
import { WrapTxCreator } from "./wrapped-tx-creator"

export interface MultisigTxCreatorOptions<Address> {
  method: (
    approvals: Array<Address>,
    threshold: number,
  ) => "as_multi" | "approve_as_multi"
}
const defaultMultisigTxCreatorOptions: MultisigTxCreatorOptions<unknown> = {
  method: (approvals, threshold) =>
    approvals.length === threshold - 1 ? "as_multi" : "approve_as_multi",
}

export function getMultisigTxCreator<
  Address extends SS58String | HexString,
  T extends TxCreator<any>,
>(
  multisig: {
    threshold: number
    signatories: Address[]
  },
  getMultisigInfo: (
    multisig: Address,
    callHash: SizedHex<32>,
  ) => Promise<
    | {
        when: {
          height: number
          index: number
        }
        approvals: Array<Address>
      }
    | undefined
  >,
  txCreator: T & { publicKey: Uint8Array; accountId?: Uint8Array },
  options?: MultisigTxCreatorOptions<Address>,
): WrapTxCreator<T> {
  const resolvedOptions = {
    ...defaultMultisigTxCreatorOptions,
    ...options,
  }

  const toSS58 = AccountId().dec
  const toAddress = (value: Uint8Array): Address => {
    if (multisig.signatories[0].startsWith("0x")) {
      return toHex(value) as Address
    }
    return toSS58(value) as Address
  }

  const pubKeys = sortMultisigSignatories(
    multisig.signatories.map(getPublicKey),
  )
  const multisigId = getMultisigAccountId({
    threshold: multisig.threshold,
    signatories: pubKeys,
  })

  const signerAddress = txCreator.accountId ?? txCreator.publicKey
  const otherSignatories = pubKeys.filter(
    (addr) => !u8ArrEq(addr, signerAddress),
  )
  if (otherSignatories.length === multisig.signatories.length) {
    throw new Error("Signer is not one of the signatories of the multisig")
  }

  const factory: TxCreator<any> = async (
    payload,
    opts,
    bindings,
    mockedSignature,
  ) => {
    const callData = fromHex(payload.callData)
    const callHash = Blake2256(callData)
    const { dynamicBuilder, callCodec } = getCodecs(
      fromHex(payload.context.metadata),
    )

    // Try as_multi_threshold_1
    if (multisig.threshold === 1) {
      try {
        const { location, codec } = dynamicBuilder.buildCall(
          "Multisig",
          "as_multi_threshold_1",
        )
        const wrappedPayload = codec.enc({
          other_signatories: otherSignatories.map(toAddress),
          call: callCodec.dec(callData),
        })
        const wrappedCallData = mergeUint8([
          new Uint8Array(location),
          wrappedPayload,
        ])
        return txCreator(
          { ...payload, callData: toHex(wrappedCallData) },
          opts,
          bindings,
          mockedSignature,
        )
      } catch {}
    }

    const txPaymentCodecs = dynamicBuilder.buildRuntimeCall(
      "TransactionPaymentApi",
      "query_info",
    )

    const unsignedExtrinsic = mergeUint8([new Uint8Array([4]), callData])
    const [multisigInfo, weightInfo] = await Promise.all([
      getMultisigInfo(toAddress(multisigId), toHex(callHash)),
      firstValueFrom(
        bindings
          .call(
            "TransactionPaymentApi_query_info",
            txPaymentCodecs.args.enc([
              unsignedExtrinsic,
              unsignedExtrinsic.length,
            ]),
            payload.context.bestBlockHash,
          )
          .pipe(map((res) => txPaymentCodecs.value.dec(res))),
      ),
    ])

    if (
      multisigInfo?.approvals.some((approval) =>
        u8ArrEq(getPublicKey(approval), txCreator.publicKey),
      )
    ) {
      throw new Error("Multisig call already approved by signer")
    }

    const method = resolvedOptions.method(
      multisigInfo?.approvals ?? [],
      multisig.threshold,
    )

    let wrappedCallData
    try {
      const { location, codec } = dynamicBuilder.buildCall("Multisig", method)
      const wrappedPayload = codec.enc({
        threshold: multisig.threshold,
        other_signatories: otherSignatories.map(toAddress),
        max_weight: weightInfo.weight,
        maybe_timepoint: multisigInfo?.when,
        ...(method === "as_multi"
          ? {
              call: callCodec.dec(callData),
            }
          : {
              call_hash: toHex(callHash),
            }),
      })
      wrappedCallData = mergeUint8([new Uint8Array(location), wrappedPayload])
    } catch {
      throw new Error(
        `Unsupported runtime version: Multisig.${method} not present or changed substantially`,
      )
    }

    return txCreator(
      { ...payload, callData: toHex(wrappedCallData) },
      opts,
      bindings,
      mockedSignature,
    )
  }

  return Object.assign(factory as T, {
    publicKey: txCreator.publicKey,
    accountId: multisigId,
  })
}

const u8ArrEq = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

const getPublicKey = (addr: SS58String | HexString) => {
  if (addr.startsWith("0x")) {
    return fromHex(addr)
  }
  const info = getSs58AddressInfo(addr)
  if (!info.isValid) {
    throw new Error(`Invalid SS58 address ${addr}`)
  }
  return info.publicKey
}
