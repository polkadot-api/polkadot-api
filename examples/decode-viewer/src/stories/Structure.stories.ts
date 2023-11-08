import type { Meta, StoryObj } from "@storybook/react"

import { Structure } from "./Structure"

const meta = {
  title: "Component/Structure",
  component: Structure,
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Structure>

export default meta
type Story = StoryObj<typeof meta>

export const Utility: Story = {
  args: JSON.parse(
    `{"pallet":{"value":{"name":"Utility","idx":24},"input":"0x18"},"call":{"value":{"name":"batch","idx":0},"input":"0x00","docs":["Send a batch of dispatch calls.","","May be called from any origin except \`None\`.","","- \`calls\`: The calls to be dispatched from the same origin. The number of call must not","  exceed the constant: \`batched_calls_limit\` (available in constant metadata).","","If origin is root then the calls are dispatched without checking origin filter. (This","includes bypassing \`frame_system::Config::BaseCallFilter\`).","","## Complexity","- O(C) where C is the number of calls to be batched.","","This will return \`Ok\` in all circumstances. To determine the success of the batch, an","event is deposited. If a call failed and the batch was interrupted, then the","\`BatchInterrupted\` event is deposited, along with the number of successful calls made","and the error of the failed call. If all were successful, then the \`BatchCompleted\`","event is deposited."]}}`,
  ),
}

export const FellowshipReferenda: Story = {
  args: JSON.parse(
    `{"pallet":{"value":{"name":"FellowshipReferenda","idx":23},"input":"0x17"},"call":{"value":{"name":"submit","idx":0},"input":"0x00","docs":["Propose a referendum on a privileged action.","","- \`origin\`: must be \`SubmitOrigin\` and the account must have \`SubmissionDeposit\` funds","  available.","- \`proposal_origin\`: The origin from which the proposal should be executed.","- \`proposal\`: The proposal.","- \`enactment_moment\`: The moment that the proposal should be enacted.","","Emits \`Submitted\`."]}}`,
  ),
}
