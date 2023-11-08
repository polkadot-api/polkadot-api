import { Button, Grid } from "@polkadot-cloud/react"
import { InitStruct, InitStructWithDocs } from "./types"
import { Input } from "../Input"

import "./index.css"

interface StructureProps {
  pallet: InitStruct
  call: InitStructWithDocs
}

const separatorStyle = {
  border: "0.1rem dashed #999",
  padding: "0.2rem",
  TextAlign: "center",
}

export const Structure = ({ pallet, call }: StructureProps) => {
  console.log(JSON.stringify({ pallet, call }))
  return (
    <Grid row style={Object.assign({}, separatorStyle, { marginTop: "1rem" })}>
      <Grid column md={12} style={separatorStyle}>
        <Input
          isSimple
          label={"Decoded call"}
          value={pallet.value.name}
          disabled
        />
        <Input isSimple label={"Call"} value={call.value.name} disabled />
        {call.docs.length > 0 ? (
          <>
            <div className="help_tooltip">
              <Button type="help" outline />
              <span className="help_tooltiptext">
                {call.docs?.map((d) => <span>{d}</span>)}
              </span>
            </div>
          </>
        ) : null}
      </Grid>
    </Grid>
  )
}
