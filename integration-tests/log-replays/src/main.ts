import { ChildProcessWithoutNullStreams, spawn } from "child_process"

function txWithCompetingForks(childProcess: ChildProcessWithoutNullStreams) {
  return new Promise<void>((resolve, reject) => {
    childProcess.stderr.pipe(process.stderr)

    childProcess.on("exit", (e) => {
      if (e !== 0) {
        reject(new Error("`txWithCompetingForks` errored"))
      } else {
        resolve()
      }
    })

    setTimeout(() => {
      reject(new Error("Timeout"))
      childProcess.unref()
      childProcess.kill()
    }, 5_000)
  })
}

const tests = {
  txWithCompetingForks: [
    "tx-with-competing-forks",
    txWithCompetingForks,
  ] as const,
}

try {
  await Promise.all(
    Object.values(tests).map(([key, fn]) => fn(spawn("pnpm", [key]))),
  )
  process.exit(0)
} catch (e) {
  console.error(e)
  process.exit(1)
}
