import type { Meta, StoryObj } from "@storybook/react"

import { ArgsStructure } from "./ArgStructure"

const meta = {
  title: "Component/ArgStructure",
  component: ArgsStructure,
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof ArgsStructure>

export default meta
type Story = StoryObj<typeof meta>

export const Calls: Story = {
  args: JSON.parse(
    `{"value":{"calls":{"codec":"Sequence","value":[{"codec":"Enum","value":{"tag":"Balances","value":{"codec":"Enum","value":{"tag":"transfer","value":{"codec":"Struct","value":{"dest":{"codec":"Enum","value":{"tag":"Id","value":{"codec":"AccountId","value":{"address":"HZZ7X3nzKuYpdrT7wSDBb8HqB7cc8z77C8oVi2MACzfAhh4","ss58Prefix":2},"input":"0xdc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d"}},"input":"0x00dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d","docs":[],"path":["sp_runtime","multiaddress","MultiAddress"]},"value":{"codec":"compactBn","value":"4000000000000","input":"0x0b00409452a303"}},"input":"0x00dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a303","innerDocs":{"dest":[],"value":[]}}},"input":"0x0700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a303","docs":["Alias for \`transfer_allow_death\`, provided only for name-wise compatibility.","","WARNING: DEPRECATED! Will be released in approximately 3 months."],"path":["pallet_balances","pallet","Call"]}},"input":"0x040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a303","docs":[],"path":["kusama_runtime","RuntimeCall"]},{"codec":"Enum","value":{"tag":"Staking","value":{"codec":"Enum","value":{"tag":"nominate","value":{"codec":"Struct","value":{"targets":{"codec":"Sequence","value":[{"codec":"Enum","value":{"tag":"Id","value":{"codec":"AccountId","value":{"address":"HZZ7X3nzKuYpdrT7wSDBb8HqB7cc8z77C8oVi2MACzfAhh4","ss58Prefix":2},"input":"0xdc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d"}},"input":"0x00dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d","docs":[],"path":["sp_runtime","multiaddress","MultiAddress"]}],"input":"0x0400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d"}},"input":"0x0400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d","innerDocs":{"targets":[]}}},"input":"0x050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d","docs":["Declare the desire to nominate \`targets\` for the origin controller.","","Effects will be felt at the beginning of the next era.","","The dispatch origin for this call must be _Signed_ by the controller, not the stash.","","## Complexity","- The transaction's complexity is proportional to the size of \`targets\` (N)","which is capped at CompactAssignments::LIMIT (T::MaxNominations).","- Both the reads and writes follow a similar pattern."],"path":["pallet_staking","pallet","pallet","Call"]}},"input":"0x06050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d","docs":[],"path":["kusama_runtime","RuntimeCall"]}],"input":"0x08040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d"}},"codec":"Struct","innerDocs":{"calls":[]},"input":"0x08040700dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d0b00409452a30306050400dc97b0271418c41f80d049826cfb1d6bd2e44e11ea39759addf6b01632ca973d"}`,
  ),
}

export const Proposals: Story = {
  args: JSON.parse(
    `{"value":{"proposal_origin":{"codec":"Enum","value":{"tag":"Origins","value":{"codec":"Enum","value":{"tag":"Fellows","value":{"codec":"_void","input":"0x"}},"input":"0x0f","docs":[],"path":["kusama_runtime","governance","origins","pallet_custom_origins","Origin"]}},"input":"0x2b0f","docs":[],"path":["kusama_runtime","OriginCaller"]},"proposal":{"codec":"Enum","value":{"tag":"Inline","value":{"codec":"Bytes","value":"0x00004901415050524f56455f52464328303030352c3963626162666138303539386432393335383330633039633138653061306534656438323237623863386637343466316634613431643835393762623664343429","input":"0x590100004901415050524f56455f52464328303030352c3963626162666138303539386432393335383330633039633138653061306534656438323237623863386637343466316634613431643835393762623664343429"}},"input":"0x01590100004901415050524f56455f52464328303030352c3963626162666138303539386432393335383330633039633138653061306534656438323237623863386637343466316634613431643835393762623664343429","docs":[],"path":["frame_support","traits","preimages","Bounded"]},"enactment_moment":{"codec":"Enum","value":{"tag":"After","value":{"codec":"u32","value":1,"input":"0x01000000"}},"input":"0x0101000000","docs":[],"path":["frame_support","traits","schedule","DispatchTime"]}},"codec":"Struct","innerDocs":{"proposal_origin":[],"proposal":[],"enactment_moment":[]},"input":"0x2b0f01590100004901415050524f56455f52464328303030352c39636261626661383035393864323933353833306330396331386530613065346564383232376238633866373434663166346134316438353937626236643434290101000000"}`,
  ),
}
