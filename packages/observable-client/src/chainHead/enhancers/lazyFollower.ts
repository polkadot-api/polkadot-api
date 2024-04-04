import { FollowResponse } from "@polkadot-api/substrate-client"

export const withLazyFollower =
  (getFollower: () => FollowResponse) =>
  <Key extends keyof FollowResponse>(key: Key): FollowResponse[Key] =>
  (...args: any[]) =>
    (getFollower() as any)[key](...args)
