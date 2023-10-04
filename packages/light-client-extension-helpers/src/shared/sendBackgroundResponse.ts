import { BackgroundResponse, BackgroundResponseError } from "@/protocol"

export const sendBackgroundResponse = (
  sendResponseCb: (msg: any) => void,
  msg: BackgroundResponse | BackgroundResponseError,
) => sendResponseCb(msg)
