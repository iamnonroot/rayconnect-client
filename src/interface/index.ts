export * from './service.auth';
export * from './query';
export * from './service.query';
export * from './service.storage';

export interface IRayconnectOption {
    aid: string
    scopes: string[]
    space?: 'main' | string
    type?: 'client' | 'micro'
}