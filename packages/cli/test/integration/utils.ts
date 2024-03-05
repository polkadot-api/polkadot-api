export const mapDescriptorRecords = (records: any) => {
  const descriptors: Record<
    string,
    [
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
    ]
  > = {}

  for (const [
    pallet,
    { storage, extrinsics, events, errors, constants },
  ] of Object.entries<any>(records)) {
    descriptors[pallet] = [storage, extrinsics, events, errors, constants]
  }

  return descriptors
}
