import Rayconnect from 'rayconnect-client';
import { KeyValue, IStorageOptions } from "../interface/service.storage";

let databases: any = {};

type StorageOf<T> = new (...args: any[]) => T;

export class StorageService {
    constructor(private rayconnect: Rayconnect, private options: IStorageOptions = { key: 'storage' }) { }

    public get<T>(name: string): T {
        return databases[name];
    }

    public from<T>(database: StorageOf<T>): void {
        let item: T = new database(this.rayconnect);
        let name: string = (item as any)['STORAGE_NAME'];
        Object.assign(databases, { [name]: item });
    }


    public async setItem<T>(key: string, value: T): Promise<void> {
        let item = await this.getItem(key);
        if (item) await this.updateItem(item.id, key, value);
        else await this.addItem(key, value);
    }

    public async getItem<T>(key: string): Promise<KeyValue<T> | null> {
        let result = await this.rayconnect.store.findByQuery(this.options.key, { key: key }) as KeyValue<T>[] | null;
        if (!result || result.length == 0) return null;
        else return result[0];
    }

    public async removeItem(key: string): Promise<void> {
        let item = await this.getItem(key);
        if (item) await this.rayconnect.store.remove(this.options.key, item.id);
    }

    public async hasItem(key: string): Promise<boolean> {
        return await this.getItem(key) != null;
    }

    private async updateItem<T>(id: string, key: string, value: T): Promise<void> {
        await this.rayconnect.store.update(this.options.key, id, { key, value });
    }

    private async addItem<T>(key: string, value: T): Promise<void> {
        await this.rayconnect.store.add(this.options.key, { key, value });
    }
}