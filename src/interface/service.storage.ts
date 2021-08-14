export interface IStorageOptions {
    key: string
}

export interface KeyValue<T> {
    id: string
    key: string
    value: T
}