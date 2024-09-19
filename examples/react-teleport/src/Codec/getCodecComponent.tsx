import { V15 } from "@polkadot-api/substrate-bindings"
import { V14 } from "@polkadot-api/substrate-bindings"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { HexString } from "polkadot-api"
import React from "react"

import * as _baseComponents from "./CodecComponents"

export const getCodecComponent = (
  baseComponents: typeof _baseComponents,
): React.FC<{
  metadata: V14 | V15
  typeRegistry: number
  value?: Uint8Array | HexString
}> => {
  getLookupFn()
  return () => null
}
