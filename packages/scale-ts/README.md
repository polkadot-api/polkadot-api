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
Something really cool about this library is that by having composable
codecs and higher order codecs with really good typings, then the
inferred types of the custom codecs are also really good. For instance,
the inferred types of the `myCodec` defined above are:
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

/*
That's very useful, because on the one hand we will get a TS error if
we try to pass an invalid input to the encoder, for instance TS will
complain that the `value` of the property `event` is not valid, in the
following example:
*/

myCodec.enc({
  event: { tag: 'one', value: 5 },
  name: "Some name",
  id: 100,
  friendIds: [1, 2, 3],
})

/*
On the other hand, the result of the decoded value, also has that
same interface, which is extremely useful.

An example on how to encoded/decode a valid value:
*/

myCodec.enc({
  id: 100,
  name: "Some name",
  friendIds: [1, 2, 3],
  event: { tag: "allOrNothing" as const, value: true },
})
// => 0x6400000024536f6d65206e616d650c0100000002000000030000000301

const decodedData = myCodec.dec(
  '0x6400000024536f6d65206e616d650c0100000002000000030000000301'
)

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

In this library you won't find common definitions like `AccountId`.
However, since the definitions of this library are enhanceable and
composable, it is very easy to create new custom definitions. For
instance, the implementation of the `bool` Codec looks like this:

```ts
import { enhanceCodec, u8, Codec } from "../"

const booleanToNumber = (value: boolean) => (value ? 1 : 0)

export const bool: Codec<boolean> = enhanceCodec(u8, booleanToNumber, Boolean)
```

Similarly, you could implement any other definitions are that based
on other definitions. For instance, a possible implementation of an
`AccountId` definition could be:

```ts
import { enhanceCodec, Bytes } from "scale-ts"
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"

export const AccountId = enhanceCodec(Bytes(32), decodeAddress, encodeAddress)
```

## API - Codecs

### [Fixed-width integers](https://docs.substrate.io/v3/advanced/scale-codec/#fixed-width-integers)

Supported codecs are: `u8`, `u16`, `u32`, `u64`, `u128`,
`i8`, `i16`, `i32`, `i64`, `i128`

```ts
i128.enc(-18676936063680574795862633153229949450n)
// => 0xf6f5f4f3f2f1f0f9f8f7f6f5f4f3f2f1

i128.dec("0xf6f5f4f3f2f1f0f9f8f7f6f5f4f3f2f1")
// => -18676936063680574795862633153229949450n
```

### [Compact/general integers](https://docs.substrate.io/v3/advanced/scale-codec/#compactgeneral-integers)

```ts
compact.enc(65535)
// => 0xfeff0300

compact.dec("0xfeff0300")
// => 65535
```

### [bool](https://docs.substrate.io/v3/advanced/scale-codec/#boolean)

```ts
bool.enc(false)
// => 0x00

bool.dec("0x01")
// => true
```

### [Option](https://docs.substrate.io/v3/advanced/scale-codec/#options)

```ts
cosnt optionalCompact = Option(compact)

optionalCompact.enc()
// => 0x00

optionalCompact.enc(undefined)
// => 0x00

optionalCompact.enc(1)
// => 0x0104

cosnt optionalBool = Option(bool)

optionalBool.enc()
// => 0x00

optionalBool.enc(true)
// => 0x01

optionalBool.enc(false)
// => 0x02
```

### [Result](https://docs.substrate.io/v3/advanced/scale-codec/#results)

```ts
const resultCodec = Result(u8, bool)

resultCodec.enc({ success: true, value: 42 })
// => 0x002a

resultCodec.enc({ success: false, value: false })
// => 0x0100
```

### [Vector](https://docs.substrate.io/v3/advanced/scale-codec/#vectors-lists-series-sets)

Dynamic, for when the size is known at run time:

```ts
const numbers = Vector(u16)

numbers.enc([4, 8, 15, 16, 23, 42])
// => 0x18040008000f00100017002a00
```

Fixed, for when the size is known at compile time:

```ts
const fiveNumbers = Vector(u16, 5)

numbers.enc([4, 8, 15, 16, 23])
// => 0x040008000f0010001700
```

### [str](https://docs.substrate.io/v3/advanced/scale-codec/#strings)

```ts
str.enc("a$¢ह€한𐍈😃")
// => 0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883
```

### [Tuple](https://docs.substrate.io/v3/advanced/scale-codec/#tuples)

```ts
const compactAndBool = Tuple(compact, bool)

compactAndBool.enc([3, false])
// => 0x0c00
```

### [Struct](https://docs.substrate.io/v3/advanced/scale-codec/#data-structures)

```ts
const myCodec = {
  id: u32,
  name: str,
  friendIds: Vector(u32),
  event: Enum({
    _void,
    one: str,
    many: Vector(str),
    allOrNothing: bool,
  }),
}

myCodec.enc({
  id: 100,
  name: "Some name",
  friendIds: [1, 2, 3],
  event: { tag: "allOrNothing" as const, value: true },
})
// => 0x6400000024536f6d65206e616d650c0100000002000000030000000301
```

### [Enum](https://docs.substrate.io/v3/advanced/scale-codec/#enumerations-tagged-unions)

```ts
const myCodec = Enum({
  nothingHere: _void,
  someNumber: u8,
  trueOrFalse: bool,
  optionalBool: Option(bool),
  optVoid: Option(_void),
})

myCodec.enc({ tag: "nothingHere" })
// => 0x00

myCodec.dec("0x012a")
// => { tag: "someNumber", value: 42 }
```

### Bytes

Sometimes, mainly when creating your custom codecs, it's usefull
to have a codec that simply reads/writes a certain amount of bytes.
For example, see the example above for creating `AccountId`.

```ts
const threeBytes = Bytes(3)

threeBytes.enc(new Uint8Array([0, 15, 255]))
// => 0x000fff

bool.dec("0x000fff00")
// => 0x000fff
```

### `_void`

This is a special codec that it's mostly useful in combination with
`Enum`, its type is `Codec<void>`, and as you can imagine calling
`_void.enc()` returns an empty `Uint8Array`, while calling
`_void.dec()` returns `undefined`.

## API - Utils

TODO: document them

### createCodec

### enhanceEncoder

### enhanceDecoder

### enhanceCodec
