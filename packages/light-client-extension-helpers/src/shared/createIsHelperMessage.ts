import { ToPage, ToExtension, BackgroundRequest } from "@/protocol"

// TODO: narrow T with validOrigins: TMessage & { origin: TOrigins[number]
export const createIsHelperMessage =
  <T = unknown>(
    validOrigins: readonly (
      | ToPage
      | ToExtension
      | BackgroundRequest
    )["origin"][],
  ) =>
  (msg: any): msg is T => {
    if (!msg) return false
    if (!validOrigins.includes(msg?.origin)) return false
    if (!msg?.type) return false
    return true
  }
