/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComplexShape, PrimitiveDecoded } from "@polkadot-api/substrate-codegen"
import { KeyValueType } from "./types"
import { snakeToCamel } from "@polkadot-cloud/utils"
import { Input } from "../Input"

const separatorStyle = {
  border: "0.1rem dashed #999",
  padding: "0.2rem",
  TextAlign: "center",
}

interface ArgsProps {
  value: any // TODO: StringRecord<Decoded> | Decodeds
  codec: PrimitiveDecoded["codec"] | ComplexShape["codec"]
  innerDocs?: object
  docs?: [string]
  input?: string
  path?: [string]
  tag?: string
}

export const ArgsStructure = (args: ArgsProps) => {
  switch (args?.codec) {
    case "Struct": {
      // TODO: Fix the innerDocs
      const { innerDocs } = args
      const some = []
      for (const [k, v] of Object.entries(args?.value as KeyValueType)) {
        const { codec, value, input, docs, path } = v as ArgsProps
        // console.log("Struct: codec ===> ", snakeToCamel(k))
        switch (codec) {
          case "Sequence": {
            some.push(
              <div
                style={Object.assign({}, separatorStyle, {
                  marginTop: "1rem",
                })}
              >
                <div className="struct_title">{snakeToCamel(k)}</div>
                <ArgsStructure
                  codec={codec}
                  value={value}
                  input={input}
                  docs={docs}
                  path={path}
                />
              </div>,
            )
            break
          }
          case "u8":
          case "u16":
          case "u32":
          case "i8":
          case "i16":
          case "i32":
          case "compactNumber":
          case "u64":
          case "u128":
          case "u256":
          case "i64":
          case "i128":
          case "i256":
          case "str":
          case "char":
          case "bool":
          case "bitSequence":
          case "Bytes":
          case "compactBn": {
            some.push(
              <div style={separatorStyle}>
                <Input
                  label={k + " : " + codec}
                  value={value}
                  input={input}
                  codec={codec}
                  docs={docs}
                  disabled
                />
              </div>,
            )
            break
          }
          default: {
            some.push(
              <div style={separatorStyle}>
                <Input
                  isSimple
                  label={
                    snakeToCamel(k) + " : " + (path ? path?.join("/") : "")
                  }
                  value={value.tag}
                  disabled
                />
                <ArgsStructure
                  codec={codec}
                  value={value}
                  input={input}
                  docs={docs}
                  path={path}
                />
              </div>,
            )
          }
        }
      }
      return <>{some}</>
    }
    case "Enum": {
      const nextContent = args.value.value
      const { input, docs, path, codec, tag } = args.value
      return (
        <div style={{ marginLeft: "1rem" }}>
          <ArgsStructure
            tag={tag}
            codec={codec}
            value={nextContent}
            input={input}
            docs={docs}
            path={path}
          />
        </div>
      )
    }

    case "Sequence": {
      return (
        <div>
          {args.value.map((a: any) => (
            <div style={{ marginLeft: "1rem" }}>
              <ArgsStructure
                tag={a.tag}
                codec={a.codec}
                value={a.value}
                input={a.input}
                docs={a.docs}
                path={a.path}
              />
            </div>
          ))}
        </div>
      )
    }

    default: {
      // console.log("args", args)
      if (args.tag) {
        // Here all the possibilities must be checked
        const { input, path, codec, value } = args.value
        // console.log("=-=-=-=-=-=-> ", args.value.codec)
        switch (codec) {
          case "AccountId":
            return (
              <Input codec={codec} label={codec} value={value} input={input} />
            )
          case "BytesArray":
            return (
              <Input
                codec={codec}
                label={codec}
                len={args.value.len}
                value={value}
                input={input}
              />
            )

          case "u8":
          case "u16":
          case "u32":
          case "i8":
          case "i16":
          case "i32":
          case "compactNumber":
          case "u64":
          case "u128":
          case "u256":
          case "i64":
          case "i128":
          case "i256":
          case "compactBn":
          case "str":
          case "char":
          case "bool":
          case "bitSequence":
          case "Bytes":
            // console.log("jere?")
            return (
              <Input codec={codec} label={codec} value={value} input={input} />
            )
        }

        const v =
          typeof args.value?.value === "object"
            ? value?.tag || value?.codec
            : value

        // console.log("jere2", value, typeof value?.value)
        return typeof value?.value !== "string" ? (
          <>
            <Input
              codec={codec}
              label={args?.tag + " : " + path?.join("/")}
              value={v}
              input={input}
            />
            <ArgsStructure
              tag={value?.value?.tag}
              codec={value?.value?.codec}
              value={value?.value?.value}
              input={value?.value?.input}
              docs={value?.value?.docs}
              path={value?.value?.path}
            />
          </>
        ) : (
          <Input
            codec={codec}
            label={args?.tag + " : " + path?.join("/")}
            value={v}
            input={input}
          />
        )
        // TODO: Check if this else is needed
        // } else {
        //   // console.log("value={args.value?.value?.tag", args)
        //   // TODO: Fix docs and path if needed
        //   const { codec, value, input, docs, path } = args
        //   return (
        //     <Input
        //       label={codec}
        //       codec={codec}
        //       value={value}
        //       input={input || ""}
        //       docs={docs}
        //     />
        //   )
      }
    }
  }
}