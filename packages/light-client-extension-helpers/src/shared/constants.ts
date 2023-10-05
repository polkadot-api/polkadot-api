const extensionPrefix = "@polkadot-api/light-client-extension-helper"

const contextPrefix = `${extensionPrefix}-context`
export const CONTEXT = {
  CONTENT_SCRIPT: `${contextPrefix}-content-script`,
  BACKGROUND: `${contextPrefix}-background`,
  EXTENSION_PAGE: `${contextPrefix}-extension-page`,
  WEB_PAGE: `${contextPrefix}-web-page`,
} as const

const portPrefix = `${extensionPrefix}-port`
export const PORT = {
  CONTENT_SCRIPT: `${portPrefix}-content-script`,
  EXTENSION_PAGE: `${portPrefix}-extension-page`,
} as const
