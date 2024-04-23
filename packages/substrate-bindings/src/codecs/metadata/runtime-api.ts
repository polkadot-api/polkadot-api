import { Struct, Vector, str } from "scale-ts"
import { docs } from "./docs"
import { compactNumber as ty } from "../scale"

export const runtimeApi = Struct({
  name: str,
  methods: Vector(
    Struct({
      name: str,
      inputs: Vector(
        Struct({
          name: str,
          type: ty,
        }),
      ),
      output: ty,
      docs,
    }),
  ),
  docs,
})
