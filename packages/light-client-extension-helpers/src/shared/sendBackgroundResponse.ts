import { BackgroundResponse, BackgroundResponseError } from "@/protocol"

export const sendBackgroundResponse = <
  T extends BackgroundResponse | BackgroundResponseError,
>(
  sendResponseCb: (msg: T) => void,
  msg: T,
) => sendResponseCb(msg)
