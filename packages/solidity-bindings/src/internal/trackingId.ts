let nextId = 1
export const getTrackingId = () => nextId++

export const logResponse = (
  meta: { type: string },
  logger?: (x: any) => void,
) =>
  [
    <T>(response: T): T => {
      logger?.({ ...meta, type: meta.type + "_response", response })
      return response
    },
    (error: any) => {
      logger?.({ ...meta, type: meta.type + "_response", error })
      throw error
    },
  ] as const
