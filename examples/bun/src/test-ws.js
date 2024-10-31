import { getWsProvider } from "polkadot-api/ws-provider/node"

getWsProvider({
  endpoints: ["https://www.randomkittengenerator.com/"],
  timeout: 100,
})(console.log)
