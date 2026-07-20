import { readdir, readFile, writeFile } from "node:fs/promises"
import { Socket } from "node:net"
import { dirname, join, parse, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const CONNECT_TIMEOUT_MS = 5_000
const specsDir = join(dirname(fileURLToPath(import.meta.url)), "specs")
const cwd = process.cwd()

type ChainSpec = {
  bootNodes?: unknown
}

const specFiles = await getSpecFiles(process.argv.slice(2))

console.log(`Checking ${specFiles.length} chainspecs...`)

for (const specFile of specFiles) {
  const result = await cleanBootNodes(specFile)
  const status = result.updated ? "updated" : "unchanged"

  console.log(
    `${relative(cwd, specFile)}: ${status} (${result.reachable}/${result.total} reachable)`,
  )
}

async function getSpecFiles(patterns: Array<string>) {
  const files =
    patterns.length > 0
      ? (await Promise.all(patterns.map(resolvePattern))).flat()
      : (await readdir(specsDir)).map((filename) => join(specsDir, filename))

  const jsonFiles = files.filter((filename) => filename.endsWith(".json"))
  const uniqueFiles = [...new Set(jsonFiles)]

  if (uniqueFiles.length === 0) {
    throw new Error("No chainspec JSON files matched")
  }

  return uniqueFiles.sort()
}

async function resolvePattern(pattern: string) {
  if (!hasGlob(pattern)) {
    return [resolve(pattern)]
  }

  const matches = await expandGlob(resolve(pattern))

  if (matches.length === 0) {
    throw new Error(`No files matched ${pattern}`)
  }

  return matches
}

async function expandGlob(pattern: string): Promise<Array<string>> {
  const { root } = parse(pattern)
  const segments = pattern.slice(root.length).split("/").filter(Boolean)

  return expandGlobSegments(root, segments)
}

async function expandGlobSegments(base: string, segments: Array<string>) {
  if (segments.length === 0) return [base]

  const [segment, ...rest] = segments

  if (!hasGlob(segment)) {
    return expandGlobSegments(join(base, segment), rest)
  }

  const entries = await readdir(base, { withFileTypes: true })
  const regex = globSegmentToRegExp(segment)
  const matches = entries.filter((entry) => regex.test(entry.name))
  const nestedMatches = await Promise.all(
    matches.map((entry) => {
      if (rest.length > 0 && !entry.isDirectory()) return []
      return expandGlobSegments(join(base, entry.name), rest)
    }),
  )

  return nestedMatches.flat()
}

function hasGlob(pattern: string) {
  return pattern.includes("*") || pattern.includes("?")
}

function globSegmentToRegExp(segment: string) {
  let source = "^"

  for (const char of segment) {
    if (char === "*") {
      source += ".*"
    } else if (char === "?") {
      source += "."
    } else {
      source += char.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
    }
  }

  return new RegExp(`${source}$`)
}

async function cleanBootNodes(chainSpecPath: string) {
  const chainSpec = JSON.parse(
    await readFile(chainSpecPath, "utf-8"),
  ) as ChainSpec

  if (!Array.isArray(chainSpec.bootNodes)) {
    throw new Error(`No bootNodes array found in ${chainSpecPath}`)
  }

  const bootNodes = chainSpec.bootNodes.filter(
    (bootNode): bootNode is string => {
      return typeof bootNode === "string"
    },
  )

  const reachableBootNodes = await Promise.all(
    bootNodes.map(async (bootNode) => {
      const endpoint = getTcpEndpoint(bootNode)
      if (!endpoint) return null

      const isReachable = await canConnect(endpoint.host, endpoint.port)
      return isReachable ? bootNode : null
    }),
  )

  const filteredBootNodes = reachableBootNodes.filter(
    (bootNode): bootNode is string => {
      return bootNode !== null
    },
  )

  const updated = !areEqual(bootNodes, filteredBootNodes)

  if (updated) {
    chainSpec.bootNodes = filteredBootNodes
    await writeFile(chainSpecPath, `${JSON.stringify(chainSpec, null, 2)}\n`)
  }

  return {
    reachable: filteredBootNodes.length,
    total: bootNodes.length,
    updated,
  }
}

function getTcpEndpoint(bootNode: string) {
  const parts = bootNode.split("/").filter(Boolean)
  const tcpIndex = parts.indexOf("tcp")

  if (tcpIndex < 2) return null

  const hostProtocol = parts[tcpIndex - 2]
  if (
    hostProtocol !== "dns" &&
    hostProtocol !== "dns4" &&
    hostProtocol !== "dns6" &&
    hostProtocol !== "ip4" &&
    hostProtocol !== "ip6"
  ) {
    return null
  }

  const host = parts[tcpIndex - 1]
  const port = Number(parts[tcpIndex + 1])

  if (!host || !Number.isInteger(port) || port <= 0 || port > 65_535) {
    return null
  }

  return { host, port }
}

function canConnect(host: string, port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = new Socket()
    let settled = false

    const done = (result: boolean) => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve(result)
    }

    socket.setTimeout(CONNECT_TIMEOUT_MS)
    socket.once("connect", () => done(true))
    socket.once("error", () => done(false))
    socket.once("timeout", () => done(false))
    socket.connect(port, host)
  })
}

function areEqual(left: Array<string>, right: Array<string>) {
  return (
    left.length === right.length && left.every((item, i) => item === right[i])
  )
}
