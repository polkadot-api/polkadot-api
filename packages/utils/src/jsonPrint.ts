export const jsonPrint = (value: any, indent = 2) =>
  JSON.stringify(
    value,
    (_, v) =>
      typeof v === "bigint"
        ? `${v}n`
        : typeof v === "object" && typeof v?.asHex === "function"
          ? v.asHex()
          : v,
    indent,
  )
