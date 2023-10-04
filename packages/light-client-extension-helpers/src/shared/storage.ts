type StorageEntry =
  | { type: "chain"; genesisHash: string }
  | { type: "bootNodes"; genesisHash: string }
  | { type: "databaseContent"; genesisHash: string }

type ChainInfo = {
  genesisHash: string
  name: string
  chainSpec: string
  relayChainGenesisHash?: string
  ss58Format: number
}

type StorageEntryValue<E extends StorageEntry> = E["type"] extends "chain"
  ? ChainInfo
  : E["type"] extends "bootNodes"
  ? string[]
  : E["type"] extends "databaseContent"
  ? string
  : never

const keyOf = ({ type, genesisHash }: StorageEntry) => {
  if (!type.length || !genesisHash.length) throw new Error("Invalid entry")

  return `${type}_${genesisHash}`
}

export const get = async <E extends StorageEntry>(
  entry: E,
): Promise<StorageEntryValue<E> | undefined> => {
  const key = keyOf(entry)
  // console.log("key", { [key]: undefined })
  // const { [key]: value } = await chrome.storage.local.get({ [key]: undefined })
  const { [key]: value } = await chrome.storage.local.get([key])
  return value
}

export const set = <E extends StorageEntry>(
  entry: E,
  value: StorageEntryValue<E>,
) => chrome.storage.local.set({ [keyOf(entry)]: value })

export const remove = (entry: StorageEntry) =>
  chrome.storage.local.remove(keyOf(entry))

export const onChainsChanged = (
  callback: (chains: Record<string, ChainInfo>) => void,
) => {
  const listener = async (changes: {
    [key: string]: chrome.storage.StorageChange
  }) => {
    if (!Object.keys(changes).some((key) => key.startsWith("chain_"))) return
    callback(await getChains())
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}

export const getChains = async (): Promise<Record<string, ChainInfo>> =>
  Object.fromEntries(
    Object.entries(await chrome.storage.local.get())
      .filter((entry): entry is [string, ChainInfo] =>
        entry[0].startsWith("chain_"),
      )
      .map(([_, chain]) => [chain.genesisHash, chain]),
  )
