import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "./Input"

const meta = {
  title: "Component/Input",
  component: Input,
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: "AccountId",
    value: {
      ss58Prefix: 0,
      address: "5DX6YxwfzPugSxrZ84aTdqycAccLCVhUffroAnGT9yHyhUch",
    },
    codec: "AccountId",

    input:
      "0x01590100004901415050524f56455f52464328303030352c3963626162666138303539386432393335383330633039633138653061306534656438323237623863386637343466316634613431643835393762623664343429",
    meta: {
      path: ["path", "some"],
      docs: "here are some docs that need to be docs but its not docs its just some text",
    },
  },
}

export const u32: Story = {
  args: {
    label: "number",
    value: 1,
    codec: "u32",
  },
}

export const u16: Story = {
  args: {
    label: "number",
    value: 8417,
    codec: "u16",
  },
}

export const BytesArray: Story = {
  args: {
    label: "BytesArray",
    value: "0x01000000",
    codec: "BytesArray",
    len: 8,
  },
}

export const Bytes: Story = {
  args: {
    label: "Bytes",
    value: {
      "0": 0,
      "1": 0,
      "2": 73,
      "3": 1,
      "4": 65,
      "5": 80,
      "6": 80,
      "7": 82,
      "8": 79,
      "9": 86,
      "10": 69,
      "11": 95,
      "12": 82,
      "13": 70,
      "14": 67,
      "15": 40,
      "16": 48,
      "17": 48,
      "18": 48,
      "19": 53,
      "20": 44,
      "21": 57,
      "22": 99,
      "23": 98,
      "24": 97,
      "25": 98,
      "26": 102,
      "27": 97,
      "28": 56,
      "29": 48,
      "30": 53,
      "31": 57,
      "32": 56,
      "33": 100,
      "34": 50,
      "35": 57,
      "36": 51,
      "37": 53,
      "38": 56,
      "39": 51,
      "40": 48,
      "41": 99,
      "42": 48,
      "43": 57,
      "44": 99,
      "45": 49,
      "46": 56,
      "47": 101,
      "48": 48,
      "49": 97,
      "50": 48,
      "51": 101,
      "52": 52,
      "53": 101,
      "54": 100,
      "55": 56,
      "56": 50,
      "57": 50,
      "58": 55,
      "59": 98,
      "60": 56,
      "61": 99,
      "62": 56,
      "63": 102,
      "64": 55,
      "65": 52,
      "66": 52,
      "67": 102,
      "68": 49,
      "69": 102,
      "70": 52,
      "71": 97,
      "72": 52,
      "73": 49,
      "74": 100,
      "75": 56,
      "76": 53,
      "77": 57,
      "78": 55,
      "79": 98,
      "80": 98,
      "81": 54,
      "82": 100,
      "83": 52,
      "84": 52,
      "85": 41,
    },
    codec: "Bytes",
  },
}

export const AccountId: Story = {
  args: {
    label: "AccountId",
    value: {
      ss58Prefix: 0,
      address: "5DX6YxwfzPugSxrZ84aTdqycAccLCVhUffroAnGT9yHyhUch",
    },
    codec: "AccountId",
  },
}

export const bitSequence: Story = {
  args: {
    label: "bitSequence",
    value: {
      bitsLen: "2",
      bytes: [2, 32, 56, 78, 90, 1, 8],
    },
    codec: "bitSequence",
  },
}
