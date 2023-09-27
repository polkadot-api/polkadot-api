import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { provider } from "@polkadot-api/light-client-extension-helpers/web-page"

console.log("dapp", await provider.addChain("aa"))

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
