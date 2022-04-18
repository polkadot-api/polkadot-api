# scale-ts

A modular, composable, strongly typed and lightweight implementation of the [SCALE Codec](https://docs.substrate.io/v3/advanced/scale-ts/)

## Installation

    npm install --save scale-ts

## Usage Example

```ts
import { bool, _void, str, u32, Enum, Struct, Vector } from "scale-ts"

const myCodec = Struct({
  id: u32,
  name: str,
  friendIds: Vector(u32),
  event: Enum({
    _void,
    one: str,
    many: Vector(str),
    allOrNothing: bool,
  }),
})

/*
Something really cool about this library is that by having composable codecs
which have very good typings, then the inferred types of the resulting codecs
also have really good typings. For instance, the inferred types of codec
defined above are:
*/

type MyCodec = Codec<{
  id: number;
  name: string;
  friendIds: number[];
  event:
    | { tag: _void; value?: undefined };
    | { tag: one; value: string; }
    | { tag: many; value: string[]; }
    | { tag: allOrNothing; value: boolean; };
}>
*/

Therefore, we won't get typing errors as long as we pass a valide interface
to the encoder:

const encodedData: ArrayBuffer = myCodec.enc({
  event: { tag: 'allOrNothing', value: true },
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
the `bool` Codec looks like this:

```ts
import { enhanceCodec, u8, Codec } from "../"

const booleanToNumber = (value: boolean) => (value ? 1 : 0)

export const bool: Codec<boolean> = enhanceCodec(u8, booleanToNumber, Boolean)
```

Similarly, you could implement any other definitions are that based on other
definitions. For instance, a possible implementation of an `AccountId`
definition could be:

```ts
import { enhanceCodec, Bytes } from "scale-ts"
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"

export const AccountId = enhanceCodec(Bytes(32), decodeAddress, encodeAddress)
```
