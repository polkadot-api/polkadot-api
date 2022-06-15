export const withOverload = (idx: number, fn: any) => {
  return (arg: any) => {
    if (Array.isArray(arg)) {
      const fns = arg.map((f) => fn(f))
      return (...args: any[]) => {
        const [overloadIdx] = args.splice(idx, 1)
        fns[overloadIdx](...args)
      }
    }
    return fn(arg)
  }
}
