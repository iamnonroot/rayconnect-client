import RayconnectClient from 'rayconnect-client';
import { IRayconnectOption } from './interface';
// Services
import { AuthService } from './service/service.auth';
import { DatabaseService } from './service/service.database';
import { StorageService } from './service/service.storage';
import { UserService } from './service/service.user';
import { QueryService } from './service/service.query';
import { HttpService } from './service/service.http';

export class Rayconnect {
    public client: RayconnectClient;

    private _options: IRayconnectOption;

    get options(): IRayconnectOption {
        return { ...this._options };
    }

    constructor(options: IRayconnectOption) {
        this._options = {
            aid: options.aid,
            scopes: options.scopes,
            space: options.space || 'main',
            type: options.type || 'client',
            mode: options.mode || 'socket',
            endpoint: {
                socket: options.endpoint?.socket || 's1.iranserver1.rayconnect.ir',
                http: options.endpoint?.http || {
                    'v1': 'http.iranserver1.rayconnect.ir/api/v1',
                    'v2': 's1.iranserver1.rayconnect.ir/api/v2'
                },
            }
        }

        this.client = new RayconnectClient({
            appID: this._options.aid,
            scopes: this._options.scopes.join(','),
            space: this._options.space!,
            type: this._options.type!,
            url: this._options.endpoint?.socket,
            connected: this._options.mode != 'http',
        });

    }

    get auth(): AuthService {
        return new AuthService(this);
    }

    get user(): UserService {
        return new UserService(this);
    }

    get storage(): StorageService {
        return new StorageService(this);
    }

    get database(): DatabaseService {
        return new DatabaseService(this);
    }

    get query(): QueryService {
        return new QueryService(this);
    }

    get http(): HttpService {
        return new HttpService(this);
    }
}