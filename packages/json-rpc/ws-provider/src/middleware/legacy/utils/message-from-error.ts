export const getMsgFromErr = (e: any) => {
  if (e instanceof Error) return e.message
  if (typeof e === "string") return e
  return "Unhandled exception"
}
