export type Encoder<T> = ((value: T) => Uint8Array) & { din?: boolean }
export type Decoder<T> = ((value: Uint8Array | ArrayBuffer | string) => T) & {
  din?: boolean
}

export type Codec<T> = [Encoder<T>, Decoder<T>] & {
  enc: Encoder<T>
  dec: Decoder<T>
  din?: boolean
}

export type CodecType<T extends Codec<any>> = T extends Codec<infer V>
  ? V
  : unknown

export type StringRecord<T> = {
  [Sym: symbol]: never
  [Num: number]: never
  [Str: string]: T
}

export interface Fixed {
  value: bigint
  decimals: number
}
