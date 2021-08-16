export interface IQueryOption {
    scope: string
    method: string
    address: string,
    access?: 'guest' | '*' | string
}

export interface IQueryRequest<T> {
    body: T
    user: string
    token: string
    at: number
}

export interface IQueryResponse {
    send: (data: any) => void
}

export interface RunQuery {
    run: (request: IQueryRequest<any>, response: IQueryResponse) => Promise<void> | void
}