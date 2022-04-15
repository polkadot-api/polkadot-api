# scale-codec

A modular, composable, strongly typed and lightweight implementation of the [SCALE Codec](https://docs.substrate.io/v3/advanced/scale-codec/)

## Installation

    npm install --save @unstoppablejs/scale-codec

## Usage Example

```ts
import {
  boolean,
  empty,
  string,
  u32,
  Enum,
  Struct,
  Vector,
} from "@unstoppablejs/scale-codec"

enum Events {
  One = "One",
  Many = "Many",
  AllOrNothing = "AllOrNothing",
  Void = "Void",
}

const myCodec = Struct({
  id: u32,
  name: string,
  friendIds: Vector(u32),
  event: Enum({
    [Events.One]: string,
    [Events.Many]: Vector(string),
    [Events.Void]: empty,
  }),
})

/*
Something very important is the types that are being inferred from this definition,
which both the encoder and the decoder will use. For instance, the input of the
encoder must be compatible with the following interface:

interface SomeData {
  id: number;
  name: string;
  friendIds: number[];
  event:
    | { tag: Events.One; value: string; }
    | { tag: Events.Many; value: string[]; }
    | { tag: Events.AllOrNothing; value: boolean; };
    | { tag: Events.Void; };
}

Which, as you might expect, it's the same interface that's returned by the
decoder.
*/

const encodedData: ArrayBuffer = myCodec.enc({
  event: { tag: Events.AllOrNothing, value: true },
  name: "Some name",
  id: 100,
  friendIds: [1, 2, 3],
})

console.log(bufferToHex(encodedData))
// => 0x6400000024536f6d65206e616d650c0100000002000000030000000201

const decodedData = myCodec.dec(encodedData)
// also possible:
// const decodedData = myCodec.dec("0x6400000024536f6d65206e616d650c0100000002000000030000000201")

console.log(JSON.stringify(decodedData, null, 2))
// =>
//{
//  "id": 100,
//  "name": "Some name",
//  "friendIds": [
//    1,
//    2,
//    3
//  ],
//  "event": {
//    "tag": "allOrNothing",
//    "value": true
//  }
//}
```

## Custom definitions

In this library you won't find common definitions like `AccountId`. However,
since the definitions of this library are enhanceable and composable, it's
very easy to create new custom definitions. For instance, the implementation of
the `Str` Codec looks like this:

```ts
import { utf16StrToUtf8Bytes, utf8BytesToUtf16Str } from "@unstoppablejs/utils"
import { enhanceCodec } from "../"
import { u8 } from "./u8"
import { Vector } from "./Vector"

export const Str = enhanceCodec(
  Vector(U8, true),
  utf16StrToUtf8Bytes,
  utf8BytesToUtf16Str,
)
```

Similarly, you could implement any other definitions are that based on other
definitions. For instance, a possible implementation of an `AccountId`
definition could be:

```ts
import { enhanceCodec, Bytes } from "@unstoppablejs/scale-codec"
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"

export const AccountId = enhanceCodec(Bytes(32), decodeAddress, encodeAddress)
```
