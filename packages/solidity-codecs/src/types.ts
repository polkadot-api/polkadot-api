export type Encoder<T> = ((value: T) => Uint8Array) & { dyn?: boolean }
export type Decoder<T> = ((value: Uint8Array | ArrayBuffer | string) => T) & {
  dyn?: boolean
}

export type Codec<T> = [Encoder<T>, Decoder<T>] & {
  enc: Encoder<T>
  dec: Decoder<T>
  dyn?: boolean
}

export type CodecType<T extends Codec<any>> = T extends Codec<infer V>
  ? V
  : unknown

export type StringRecord<T> = {
  [Sym: symbol]: never
  [Num: number]: never
  [Str: string]: T
}

export interface Decimal {
  value: bigint
  decimals: number
}
