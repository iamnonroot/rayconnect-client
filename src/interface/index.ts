export * from './service.auth';
export * from './service.storage';

export interface IRayconnectOption {
    aid: string
    scopes: string[]
    space?: 'main' | string
    type?: 'client' | 'micro'
}