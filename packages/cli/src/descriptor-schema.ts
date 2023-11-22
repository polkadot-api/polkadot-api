import { z } from "zod"

export default z.record(
  z.object({
    metadata: z.string(),
    chainSpec: z.string().optional(),
    outputFolder: z.string(),
  }),
)
