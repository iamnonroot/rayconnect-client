import { Rayconnect } from '../index';
import { KeyValue, IStorageOption } from "../interface/service.storage";

let storages: any = {};

type StorageOf<T> = new (...args: any[]) => T;

export class StorageService {
    constructor(private rayconnect: Rayconnect, private options: IStorageOption = { key: 'storage' }) { }

    public get<T>(name: string): T {
        return storages[name];
    }

    public from<T>(storage: StorageOf<T>): void {
        let item: T = new storage(this.rayconnect);
        let name: string = (item as any)['STORAGE_NAME'];
        Object.assign(storages, { [name]: item });
    }

    public async setItem<T>(key: string, value: T | any): Promise<boolean> {
        try {
            let result = await this.rayconnect.client.store.findByQuery(this.options.key, { key: key }) as KeyValue<T>[] | null;
            if (!result || result.length == 0) this.addItem(key, value);
            else await this.updateItem(result![0].id, key, value);
            return true;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getItem<T>(key: string): Promise<T | any | null> {
        try {
            let result = await this.rayconnect.client.store.findByQuery(this.options.key, { key: key }) as KeyValue<T>[] | null;
            if (!result || result.length == 0) return null;
            else return result[0].value;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async removeItem(key: string): Promise<boolean> {
        try {
            let result = await this.rayconnect.client.store.findByQuery(this.options.key, { key: key }) as KeyValue<any>[] | null;
            if (!result || result.length == 0) await this.rayconnect.client.store.remove(this.options.key, result![0].id);
            else return false;
            return true;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async hasItem(key: string): Promise<boolean> {
        try {
            return await this.getItem(key) != null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async updateItem<T>(id: string, key: string, value: T): Promise<void> {
        await this.rayconnect.client.store.update(this.options.key, id, { key, value });
    }

    private async addItem<T>(key: string, value: T): Promise<void> {
        await this.rayconnect.client.store.add(this.options.key, { key, value });
    }
}