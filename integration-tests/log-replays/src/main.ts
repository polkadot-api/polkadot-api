import { ChildProcessWithoutNullStreams, spawn } from "child_process"

function undefinedRuntime(childProcess: ChildProcessWithoutNullStreams) {
  return new Promise<void>((resolve, reject) => {
    childProcess.on("exit", (e) => {
      if (e !== null) {
        reject(new Error("`undefined-runtime` errored"))
      } else {
        reject(
          new Error("`undefined-runtime` exited when it wasnt supposed to"),
        )
      }
    })

    setTimeout(() => {
      resolve()
      childProcess.unref()
      childProcess.kill()
    }, 5_000)
  })
}

const tests = {
  undefinedRuntime: ["undefined-runtime", undefinedRuntime] as const,
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
