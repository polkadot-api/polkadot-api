export const wellKnownChainGenesisHashes = [
  "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
  "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
  "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e",
  "0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e",
] as const

export type WellKnownChainGenesisHash =
  (typeof wellKnownChainGenesisHashes)[number]

let chains: Record<
  WellKnownChainGenesisHash,
  Promise<{ chainSpec: string }> | undefined
>

export async function getWellKnownChainSpec(genesisHash: string) {
  if (!chains) {
    chains = {
      // Dynamic imports needs to be explicit for ParcelJS
      // See https://github.com/parcel-bundler/parcel/issues/125
      "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3":
        import("./specs/polkadot"),
      "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe":
        import("./specs/ksmcc3"),
      "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e":
        import("./specs/westend2"),
      "0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e":
        import("./specs/rococo_v2_2"),
    }
  }
  return (await chains[genesisHash as WellKnownChainGenesisHash])?.chainSpec
}
