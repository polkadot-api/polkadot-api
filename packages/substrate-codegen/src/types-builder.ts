import { V14 } from "@unstoppablejs/substrate-bindings"
import * as staticBuilder from "./static-builder"

export type TypeAndCodeDeclarations = Omit<
  staticBuilder.CodeDeclarations,
  "imports"
> & {
  importTypes: {
    type: Set<string>
    normal: Set<string>
  }
}

export const getTypesBuilder = (
  metadata: V14,
  declarations: TypeAndCodeDeclarations,
) => {
  declarations.importTypes.type.add("Codec")
  declarations.importTypes.type.add("CodecType")

  return staticBuilder.getStaticBuilder(metadata, {
    imports: declarations.importTypes.normal,
    variables: declarations.variables,
  })
}
