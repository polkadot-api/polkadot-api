export const CLA = 0xf9
export const INS = {
  getVersion: 0,
  getAddress: 1,
  signTx: 2,
  signRaw: 3,
}
export const P1 = {
  // sign
  init: 0,
  continue: 1,
  end: 2,

  // addr
  getAddress: 0,
  showAddress: 1,
}
export const P2 = {
  ed25519: 0,
  ecdsa: 2,
}
export const PUBKEY_LEN = {
  ed25519: 32,
  ecdsa: 33,
}
export const SIGN_LEN = {
  ed25519: 64,
  ecdsa: 65,
}
export const DEFAULT_SS58 = 0
