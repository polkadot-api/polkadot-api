import "@polkadot-api/light-client-extension-helpers/content-script"

console.log("content")

{
  try {
    const s = document.createElement("script")
    s.src = chrome.runtime.getURL("js/inpage.global.js")
    s.onload = function () {
      // @ts-ignore
      this.remove()
    }
    ;(document.head || document.documentElement).appendChild(s)
  } catch (error) {
    console.error("error injecting js/inpage.global.js", error)
  }
}
