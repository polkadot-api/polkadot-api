import {
  BackgroundRequest,
  BackgroundResponse,
  BackgroundResponseError,
} from "@/protocol"

// FIXME: improve typings so R is narrowed by M
export const sendBackgroundRequest = async <T extends BackgroundResponse>(
  msg: BackgroundRequest,
) => {
  const response = await chrome.runtime.sendMessage<
    BackgroundRequest,
    T | BackgroundResponseError
  >(msg)
  if (response.type === "error") throw new Error(response.error)
  return response
}
