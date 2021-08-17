export interface HttpRequestOption {
    scope?: string
    method: 'GET' | string
    address?: string
    data?: object | any
    auth?: boolean
    version?: 'v1' | 'v2',
    path: 'run' | 'guest' | 'otp' | 'me' | 'profile'
}

export interface HttpRequestResponse<T> {
    status: boolean
    body: T
    user?: string
    token?: string
    at?: number
}
