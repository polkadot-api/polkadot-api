export enum WellKnownChain {
  polkadot = "polkadot",
  ksmcc3 = "ksmcc3",
  rococo_v2_2 = "rococo_v2_2",
  westend2 = "westend2",
}

export const knownChainsData: Record<
  WellKnownChain,
  {
    chain: WellKnownChain
    chainId: string
    name: string
    ss58Format: number
    decimals: number
    symbol: string
  }
> = {
  [WellKnownChain.polkadot]: {
    chain: WellKnownChain.polkadot,
    chainId:
      "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
    name: "Polkadot",
    ss58Format: 0,
    decimals: 10,
    symbol: "DOT",
  },
  [WellKnownChain.ksmcc3]: {
    chain: WellKnownChain.ksmcc3,
    chainId:
      "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
    name: "Kusama",
    ss58Format: 2,
    decimals: 12,
    symbol: "KSM",
  },
  [WellKnownChain.westend2]: {
    chain: WellKnownChain.westend2,
    chainId:
      "0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e",
    name: "Westend",
    ss58Format: 42,
    decimals: 12,
    symbol: "WND",
  },
  [WellKnownChain.rococo_v2_2]: {
    chain: WellKnownChain.rococo_v2_2,
    chainId:
      "0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e",
    name: "Rococo",
    ss58Format: 42,
    decimals: 12,
    symbol: "ROC",
  },
}
