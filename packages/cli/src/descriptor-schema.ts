import { z } from "zod"

export default z.record(
  z.object({
    metadata: z.string(),
    chainSpec: z.string().optional(),
    outputFolder: z.string(),
    descriptors: z.record(
      z.object({
        constants: z.record(z.coerce.string()).default({}),
        storage: z.record(z.coerce.string()).default({}),
        events: z.record(z.coerce.string()).default({}),
        errors: z.record(z.coerce.string()).default({}),
        extrinsics: z
          .record(
            z.object({
              checksum: z.coerce.string(),
              events: z.record(
                z.array(z.string()).transform((s) => new Set(s)),
              ),
              errors: z.record(
                z.array(z.string()).transform((s) => new Set(s)),
              ),
            }),
          )
          .default({}),
      }),
    ),
  }),
)
