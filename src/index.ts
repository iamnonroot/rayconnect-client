import RayconnectClient from 'rayconnect-client';
import { IRayconnectOption } from './interface';
// Services
import { AuthService } from './service/service.auth';
import { StorageService } from './service/service.storage';
import { UserService } from './service/service.user';

export class Rayconnect {
    private client: RayconnectClient;

    constructor(options: IRayconnectOption) {
        this.client = new RayconnectClient({
            appID: options.aid,
            scopes: options.scopes.join(','),
            space: options.space || 'main',
            type: options.type || 'client',
        });
    }

    get auth(): AuthService {
        return new AuthService(this.client);
    }

    get user(): UserService {
        return new UserService(this.client);
    }

    get storage(): StorageService {
        return new StorageService(this.client);
    }
}