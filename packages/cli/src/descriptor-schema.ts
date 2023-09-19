import { z } from "zod"

export default z.record(
  z.object({
    metadata: z.string(),
    chainSpec: z.string().optional(),
    outputFolder: z.string(),
    descriptors: z.record(
      z.object({
        constants: z.record(z.coerce.bigint()).optional(),
        storage: z.record(z.coerce.bigint()).optional(),
        events: z.record(z.coerce.bigint()).optional(),
        errors: z.record(z.coerce.bigint()).optional(),
        extrinsics: z
          .record(
            z.object({
              checksum: z.coerce.bigint(),
              events: z.record(
                z.array(z.string()).transform((s) => new Set(s)),
              ),
              errors: z.record(
                z.array(z.string()).transform((s) => new Set(s)),
              ),
            }),
          )
          .optional(),
      }),
    ),
  }),
)
