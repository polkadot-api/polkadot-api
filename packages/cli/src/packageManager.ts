import { readdir } from "node:fs/promises"
import { join } from "node:path"
import { execa } from "execa"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"
export interface PackageManagerDetection {
  packageManager: PackageManager
  executable: string
  version: string
}
let detected: PackageManagerDetection | null = null

export async function detectPackageManager() {
  if (detected) return detected

  const { packageManager, executable } =
    (await detectByLockFile()) ?? detectByEnvironment() ?? getFallback()
  const version = await getVersion(executable)

  return (detected = {
    packageManager,
    executable,
    version,
  })
}

async function detectByLockFile(): Promise<Omit<
  PackageManagerDetection,
  "version"
> | null> {
  try {
    for (let i = 0, dir = "."; i < 5; i++, dir = join(dir, "..")) {
      const packageManager = await getByLockFile(dir)
      if (packageManager) {
        return {
          packageManager,
          executable: packageManager,
        }
      }
    }
  } catch (ex) {
    // fs access can fail for permission errors
    // We just assume that we have
  }
  return null
}

const lockFileToPackageManager: Record<string, PackageManager> = {
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lock": "bun",
  "bun.lockb": "bun",
  "package-lock.json": "npm",
}

const lockFiles = new Set(Object.keys(lockFileToPackageManager))
async function getByLockFile(dir: string) {
  const files = await readdir(dir)
  const lockFile = files.find((v) => lockFiles.has(v))
  return lockFile ? lockFileToPackageManager[lockFile] : null
}

function detectByEnvironment(): Omit<
  PackageManagerDetection,
  "version"
> | null {
  const npm_execpath = process.env.npm_execpath
  if (npm_execpath) {
    const packageManager = Object.values(lockFileToPackageManager).find(
      (manager) => npm_execpath.includes(manager),
    )
    return packageManager ? { packageManager, executable: npm_execpath } : null
  }
  if (process.env.PNPM_PACKAGE_NAME) {
    return { packageManager: "pnpm", executable: "pnpm" }
  }
  return null
}

function getFallback(): Omit<PackageManagerDetection, "version"> {
  console.warn("Package manager couldn't be detected, fallback to npm")
  return {
    executable: "npm",
    packageManager: "npm",
  }
}

async function getVersion(executable: string) {
  const res = await execa(executable, ["--version"])
  return res.stdout
}
