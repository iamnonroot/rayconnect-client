export interface UsernameAndPassword {
    username: string
    password: string
}

export interface IAuthCallback {
    getToken?(): string | null | undefined
    setToken?(token: string): void
}

export interface IAuthEvent {
    [key: string]: Function
}

export type AuthEvents = 'auth';