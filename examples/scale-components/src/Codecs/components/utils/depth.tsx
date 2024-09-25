import { createContext, useContext } from "react"

const DepthCtx = createContext<number>(0)
const useCurrentDepth = () => useContext(DepthCtx)

export const withDepth: <T extends {}>(
  base: React.FC<T & { depth: number }>,
) => React.FC<T> = (Base) => (props) => {
  const depth = useCurrentDepth()
  return (
    <DepthCtx.Provider value={depth + 1}>
      <Base {...{ depth, ...props }} />
    </DepthCtx.Provider>
  )
}
