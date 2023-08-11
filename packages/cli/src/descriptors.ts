export const DESCRIPTOR_SPEC = `
// It should NOT be exported.
interface DescriptorBase {
    type: "storage" | "event" | "tx" | "const";
    pallet: string;
    name: string;
    checksum: bigint;
}
export interface StorageDescriptor<Keys extends Array<any>, O> extends DescriptorBase {
    type: "storage";
}
export interface ConstantDescriptor<Payload> extends DescriptorBase {
    type: "const";
}
export interface EventDescriptor<Name extends string, Payload> extends DescriptorBase {
    type: "event";
    name: Name;
}
export interface CallDescriptor<Args extends Array<any>, Events extends Array<EventDescriptor<any, any>>, Errors extends Array<string>> extends DescriptorBase {
    type: "tx";
    events: Events;
    errors: Errors;
}
export type Descriptor = StorageDescriptor<any, any> | EventDescriptor<any, any> | CallDescriptor<any, any, any> | ConstantDescriptor<any>;
export type EventToObject<E extends EventDescriptor<any, any>> = E extends EventDescriptor<infer K, infer V> ? {
    type: K;
    value: V;
} : unknown;
export type UnionizeTupleEvents<E extends Array<EventDescriptor<any, any>>> = E extends Array<infer Ev> ? Ev extends EventDescriptor<any, any> ? EventToObject<Ev> : unknown : unknown;
export type CallDescriptorArgs<D extends CallDescriptor<any, any, any>> = D extends CallDescriptor<infer A, any, any> ? A : [];
export type CallDescriptorEvents<D extends CallDescriptor<any, any, any>> = D extends CallDescriptor<any, infer E, any> ? E : [];
export type CallDescriptorErrors<D extends CallDescriptor<any, any, any>> = D extends CallDescriptor<any, any, infer E> ? E extends Array<infer IE> ? IE : [] : [];
export type CallFunction<D extends CallDescriptor<any, any, any>> = (...args: CallDescriptorArgs<D>) => Promise<{
    ok: true;
    events: Array<UnionizeTupleEvents<CallDescriptorEvents<D>>>;
} | {
    ok: false;
    error: CallDescriptorErrors<D>;
}>;
export {};
`
