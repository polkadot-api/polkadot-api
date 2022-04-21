# scale-ts

A modular, composable, strongly typed and lightweight implementation of the [SCALE Codec](https://docs.substrate.io/v3/advanced/scale-codec/)

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
const numberToBoolean = Boolean

export const bool: Codec<boolean> = enhanceCodec(
  u8,
  booleanToNumber,
  numberToBoolean,
)
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

Normal cases:

```ts
cosnt optionalCompact = Option(compact)

optionalCompact.enc()
// => 0x00

optionalCompact.enc(undefined)
// => 0x00

optionalCompact.enc(1)
// => 0x0104
```

Exceptionally, if the input is `bool`, then it always returns one byte:

```ts
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
const { enc, dec } = Enum({
  nothingHere: _void,
  someNumber: u8,
  trueOrFalse: bool,
  optionalBool: Option(bool),
  optVoid: Option(_void),
})

enc({ tag: "nothingHere" })
// => 0x00

dec("0x012a")
// => { tag: "someNumber", value: 42 }
```

### Bytes

Sometimes, mainly when creating your custom codecs, it's usefull
to have a codec that simply reads/writes a certain amount of bytes.
For example, see the example above for creating `AccountId`.

```ts
const [encode, decode] = Bytes(3)

encode(new Uint8Array([0, 15, 255]))
// => 0x000fff

decode("0x000fff00")
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

## FAQ

### How can I encode/decode my custom class?

A very impotant remark is that in this library you will only find the basic
primitives that can be used for building more complex codecs. That being said,
this library provides a set of utils to facilitate that.

Probably the easiest way to explain this is by solving a couple of examples,
so let's get to it.

#### creating a custom `MapCodec`:

Let's say that you want to have a `MapCodec` function that works like this:

```ts
const myMap: Codec<Map<number, string>> = MapCodec(u8, str)
```

How could we create that `MapCodec` with this `scale-ts`? Basically, what we
want to do is to transform the result of a `Vector(Tuple(keyCodec, valueCodec))`
to a Map, and viceversa.

So, let's first create the encoder function, using `enahnceEncoder`:

```ts
const MapEncoder = <K, V>(key: Encoder<K>, value: Encoder<V>) =>
  enhanceEncoder(Vector.enc(Tuple.enc(key, value)), (input: Map<K, V>) =>
    Array.from(input.entries()),
  )
```

Now, let's create its decoder counterpart, using `enhanceDecoder`:

```ts
const MapDecoder = <K, V>(key: Decoder<K>, value: Decoder<V>) =>
  enhanceDecoder(
    Vector.dec(Tuple.dec(key, value)),
    (entries) => new Map(entries),
  )
```

Finally, lets create the `MapCodec` function:

```ts
export const MapCodec = <K, V>(
  key: Codec<K>,
  value: Codec<V>,
): Codec<Map<K, V>> =>
  createCodec(MapEncoder(key.enc, value.enc), MapDecoder(key.dec, value.dec))

MapCodec.enc = MapEncoder
MapCodec.dec = MapDecoder
```

And that's it 🎉!

#### creating a custom `ClassCodec`:

Now, let's see how we can create a more complex function, like something
for encoding and decoding the instances of our classes, even if those instances
are more than mere setters/getters. Let's say that we want to create a
`ClassCodec` function that can be used like this:

```ts
class RepeatedString {
  constructor(item: string, nTimes: number) {
    this.repetition = Array(nTimes).fill(item)
  }
}

// It's not necessary to add the `: Codec<RepeatedString> notation
// because it's going to be inferred.
const repeatedStrCodec: Codec<RepeatedString> = ClassCodec(
  RepeatedString,
  [str, compact],
  (value: RepeatedString) => [value.repetition[0], value.repetition.length],
)
```

How can we implement this `ClassCodec` with this `scale-ts`?

Basically, what we want to do is to instantiate our class using the result of a
`Tuple` and then, using a function that takes the instance of our class and
returns the values that must be encoded, return the Codec for the class.

It goes without saying that this function could have more overloads, of course,
but this is just an example.

What's very difficult about creating a function like this is to get the types
right, but let's not shy away from it.

First, let's write the function for encoding:

```ts
const ClassEncoder =
  <
    A extends Array<Encoder<any>>,
    OT extends { [K in keyof A]: A[K] extends Encoder<infer D> ? D : unknown },
    Constructor extends new (...args: OT) => any,
  >(
    mapper: (instance: InstanceType<Constructor>) => OT,
  ): Encoder<InstanceType<Constructor>> =>
  (instance) => {
    return Tuple.enc(...mapper(instance)) as any
  }
```

Again, leaving aside the complex types for inferring the arguments, the actual
JS code is fairly straight-forward.

Then, let's create the function for creating the Decoder:

```ts
const ClassDecoder = <
  A extends Array<Decoder<any>>,
  OT extends { [K in keyof A]: A[K] extends Decoder<infer D> ? D : unknown },
  Constructor extends new (...args: OT) => any,
>(
  classType: Constructor,
  ...decoders: A
): Decoder<InstanceType<Constructor>> =>
  enhanceDecoder(
    Tuple.dec(...decoders),
    (args) => new classType(...(args as any)),
  )
```

Same deal, complex types b/c we care about our users, but aside from that, the
actual JS code is pretty straight-forward.

And now we are ready to put everything together:

```ts
const ClassCodec = <
  A extends Array<Codec<any>>,
  OT extends { [K in keyof A]: A[K] extends Codec<infer D> ? D : unknown },
  Constructor extends new (...args: OT) => any,
>(
  classType: Constructor,
  codecs: A,
  mapper: (instance: InstanceType<Constructor>) => OT,
) =>
  createCodec(
    ClassEncoder(mapper),
    ClassDecoder(classType, ...codecs.map((c) => c.dec)),
  )

ClassCodec.enc = ClassEncoder
ClassCodec.dec = ClassDecoder
```

Hopefully, this 2 examples showcase the main goal of the library: to provide
good and lean building blocks, so that we can build complex things with them.

Also, it's worth pointing out that in the past this library used to have some
"sugar" codecs (`Hex`, `MapCodec`, `SetCodec`, `date32`, etc). However, they
have all been removed because since all these codecs can be implemented in
userland, if we start adding sugar, then this library could easily become a
chaotic directory with all sorts of Codecs.

That's why it's very important that its building blocks are as minimalist and
ergonomic as possible.
