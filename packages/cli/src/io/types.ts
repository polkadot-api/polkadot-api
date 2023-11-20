export type PlainDescriptor = {
  checksum: string
  payload: string
}

export interface PalletData {
  constants: Record<string, PlainDescriptor>
  errors: Record<string, PlainDescriptor>
  events: Record<string, PlainDescriptor>
  storage: Record<
    string,
    PlainDescriptor & { key: string; isOptional: boolean; len: number }
  >
  tx: Record<string, PlainDescriptor>
}
