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
export const P2 = 0
export const DEFAULT_SS58 = 0
