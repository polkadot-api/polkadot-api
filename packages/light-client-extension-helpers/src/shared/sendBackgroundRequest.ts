import {
  BackgroundRequest,
  BackgroundResponse,
  BackgroundResponseError,
} from "@/protocol"

export const sendBackgroundRequest = async <
  TRequest extends BackgroundRequest,
  TResponse extends BackgroundResponse & {
    type: `${TRequest["type"]}Response`
  },
>(
  msg: TRequest,
) => {
  // TResponse | BackgroundResponseError does not narrow
  const response: BackgroundResponse | BackgroundResponseError =
    await chrome.runtime.sendMessage(msg)
  if (response.type === "error") throw new Error(response.error)
  return response as TResponse
}
