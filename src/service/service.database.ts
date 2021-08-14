import { Rayconnect } from '../index';

let databases: any = {};

type StorageOf<T> = new (...args: any[]) => T;

export class DatabaseService {
    constructor(private rayconnect: Rayconnect) { }

    public get<T>(name: string): T {
        return databases[name];
    }

    public from<T>(database: StorageOf<T>): void {
        let item: T = new database(this.rayconnect);
        let name: string = (item as any)['DATABASE_NAME'];
        Object.assign(databases, { [name]: item });
    }

    public async create<T>(name: string, data: T): Promise<void> {
        await this.rayconnect.client.store.add(name, data as any);
    }

    public async find<T>(name: string, query: object = {}): Promise<T[]> {
        return await this.rayconnect.client.store.findByQuery(name, query) as T[];
    }

    public async findById<T>(name: string, id: string): Promise<T | null> {
        return await this.rayconnect.client.store.find(name, id) as T;
    }

    public async updateById<T>(name: string, id: string, data: T): Promise<void> {
        await this.rayconnect.client.store.update(name, id, data as any);
    }

    public async removeById(name: string, id: string): Promise<void> {
        await this.rayconnect.client.store.remove(name, id);
    }
}