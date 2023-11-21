import { getChecksumBuilder } from "@polkadot-api/substrate-codegen"
import { Data } from "./data"
import asTable from "as-table"
import chalk from "chalk"

type Discrepancy = {
  pallet: string
  type: "constant" | "storage" | "event" | "error" | "extrinsic"
  name: string
  oldChecksum: string | null
  newChecksum: string | null
}

export function checkDescriptorsForDiscrepancies(data: Data) {
  const discrepancies: Discrepancy[] = []

  const checksumBuilder = getChecksumBuilder(data.metadata.value)

  for (const [
    pallet,
    { constants, storage, events, errors, extrinsics },
  ] of Object.entries(data.descriptorData)) {
    for (const [constantName, checksum] of Object.entries(constants ?? {})) {
      const newChecksum = checksumBuilder.buildConstant(pallet, constantName)
      if (checksum != newChecksum) {
        discrepancies.push({
          pallet,
          type: "constant",
          name: constantName,
          oldChecksum: checksum,
          newChecksum: newChecksum,
        })
      }
    }
    for (const [storageName, checksum] of Object.entries(storage ?? {})) {
      const newChecksum = checksumBuilder.buildStorage(pallet, storageName)
      if (checksum != newChecksum) {
        discrepancies.push({
          pallet,
          type: "storage",
          name: storageName,
          oldChecksum: checksum,
          newChecksum: newChecksum,
        })
      }
    }
    for (const [eventName, checksum] of Object.entries(events ?? {})) {
      const newChecksum = checksumBuilder.buildEvent(pallet, eventName)
      if (checksum != newChecksum) {
        discrepancies.push({
          pallet,
          type: "event",
          name: eventName,
          oldChecksum: checksum,
          newChecksum: newChecksum,
        })
      }
    }
    for (const [errorName, checksum] of Object.entries(errors ?? {})) {
      const newChecksum = checksumBuilder.buildError(pallet, errorName)
      if (checksum != newChecksum) {
        discrepancies.push({
          pallet,
          type: "error",
          name: errorName,
          oldChecksum: checksum,
          newChecksum: newChecksum,
        })
      }
    }
    for (const [callName, checksum] of Object.entries(extrinsics ?? {})) {
      const newChecksum = checksumBuilder.buildCall(pallet, callName)
      if (checksum != newChecksum) {
        discrepancies.push({
          pallet,
          type: "extrinsic",
          name: callName,
          oldChecksum: checksum,
          newChecksum: newChecksum,
        })
      }
    }
  }

  return discrepancies
}

export function synchronizeDescriptors(
  data: Data,
  discrepancies: Discrepancy[],
) {
  for (const discrepancy of discrepancies) {
    switch (discrepancy.type) {
      case "constant": {
        const { constants } = data.descriptorData[discrepancy.pallet]
        if (!constants) {
          break
        }
        if (discrepancy.newChecksum === null) {
          delete constants[discrepancy.name]
        } else {
          constants[discrepancy.name] = discrepancy.newChecksum
        }
        break
      }
      case "storage": {
        const { storage } = data.descriptorData[discrepancy.pallet]
        if (!storage) {
          break
        }
        if (discrepancy.newChecksum === null) {
          delete storage[discrepancy.name]
        } else {
          storage[discrepancy.name] = discrepancy.newChecksum
        }
        break
      }
      case "event": {
        const { events } = data.descriptorData[discrepancy.pallet]
        if (!events) {
          break
        }
        if (discrepancy.newChecksum === null) {
          delete events[discrepancy.name]
        } else {
          events[discrepancy.name] = discrepancy.newChecksum
        }
        break
      }
      case "error": {
        const { errors } = data.descriptorData[discrepancy.pallet]
        if (!errors) {
          break
        }
        if (discrepancy.newChecksum === null) {
          delete errors[discrepancy.name]
        } else {
          errors[discrepancy.name] = discrepancy.newChecksum
        }
        break
      }
      case "extrinsic": {
        const { extrinsics } = data.descriptorData[discrepancy.pallet]
        if (!extrinsics) {
          break
        }
        if (discrepancy.newChecksum === null) {
          delete extrinsics[discrepancy.name]
        } else {
          extrinsics[discrepancy.name] = discrepancy.newChecksum
        }
        break
      }
      default:
        break
    }
  }
}

export const showDiscrepancies = (discrepancies: Discrepancy[]) => {
  const mapDiscrepancy = ({
    pallet,
    name,
    oldChecksum,
    newChecksum,
  }: (typeof discrepancies)[number]) => ({
    Pallet: pallet,
    Name: name,
    "Old Checksum": oldChecksum === null ? chalk.red(oldChecksum) : oldChecksum,
    "New Checksum": newChecksum === null ? chalk.red(newChecksum) : newChecksum,
  })

  console.log("-------- Constant Discrepancies --------")
  console.log(
    asTable(
      discrepancies
        .filter(({ type }) => type === "constant")
        .map(mapDiscrepancy),
    ),
  )
  console.log("")
  console.log("-------- Storage Discrepancies --------")
  console.log(
    asTable(
      discrepancies
        .filter(({ type }) => type === "storage")
        .map(mapDiscrepancy),
    ),
  )
  console.log("")
  console.log("-------- Event Discrepancies --------")
  console.log(
    asTable(
      discrepancies.filter(({ type }) => type === "event").map(mapDiscrepancy),
    ),
  )
  console.log("")
  console.log("-------- Error Discrepancies --------")
  console.log(
    asTable(
      discrepancies.filter(({ type }) => type === "error").map(mapDiscrepancy),
    ),
  )
  console.log("")
  console.log("-------- Extrinsic Discrepancies --------")
  console.log(
    asTable(
      discrepancies
        .filter(({ type }) => type === "extrinsic")
        .map(mapDiscrepancy),
    ),
  )
  console.log("")
}
