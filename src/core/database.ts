import { Rayconnect } from "../index";
import { IDatabaseOption } from "../interface/database";

export function Database(options: IDatabaseOption) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class Storage extends constructor {
            DATABASE_NAME: string = options.name;
        }
    }
}

export class SimpleDatabase<T> {
    constructor(protected rayconnect: Rayconnect) { }

    protected get NAME(): string {
        return (this as any)['DATABASE_NAME'];
    }

    public async find(query: object = {}): Promise<T[]> {
        return await this.rayconnect.client.store.findByQuery(this.NAME, query) as T[];
    }

    public async findById(id: string): Promise<T | null> {
        return await this.rayconnect.client.store.find(this.NAME, id) as T;
    }

    public async updateById(id: string, data: T): Promise<void> {
        await this.rayconnect.client.store.update(this.NAME, id, data as any);
    }

    public async removeById(id: string): Promise<void> {
        await this.rayconnect.client.store.remove(this.NAME, id);
    }
}