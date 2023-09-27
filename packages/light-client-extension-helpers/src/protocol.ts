export type ToExtension = {
  // FIXME: prefix origin
  origin: "web-page-helper"
  id: string
  method: string
  params?: any[]
}

export type ToPage = {
  // FIXME: prefix origin
  origin: "content-script-helper"
  // FIXME: id is optional for notifications "onChainsChange"
  id: string
  result?: any
  error?: any
}
