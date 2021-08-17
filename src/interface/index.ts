export * from './service.auth';
export * from './query';
export * from './service.query';
export * from './service.storage';
export * from './service.http';
export * from './service.user';

export interface IRayconnectOption {
    aid: string
    scopes: string[]
    space?: 'main' | string
    type?: 'client' | 'micro'
    mode?: 'socket' | 'http',
    endpoint?: {
        socket?: string
        http?: {
            v1: string
            v2: string
        }
    }
}