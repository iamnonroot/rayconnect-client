import { KeyValue } from "../interface/service.storage";
import { IStorageOption } from "../interface/storage";
import { Rayconnect } from "../index";

export function Storage(options: IStorageOption) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class Storage extends constructor {
            STORAGE_NAME: string = options.name;
        }
    }
}

export class SimpleStorage {
    constructor(protected rayconnect: Rayconnect) { }

    protected get NAME(): string {
        return (this as any)['STORAGE_NAME'];
    }
}

export class LoadAndSaveStorage<T> extends SimpleStorage {
    public items: T[] = [];

    constructor(protected rayconnect: Rayconnect) {
        super(rayconnect);
    }

    public async load(): Promise<T[]> {
        try {
            if (this.NAME == undefined) return [];
            let res = await this.rayconnect.storage.getItem<T[]>(this.NAME);
            if (res) this.items = res;
            return this.items;
        } catch (error) {
            this.items = [];
            return Promise.reject(error);
        }
    }

    public async save(): Promise<void> {
        try {
            await this.rayconnect.storage.setItem(this.NAME, this.items);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export class SetAndGetStorage<T> extends SimpleStorage {
    public async set(value: T): Promise<void> {
        await this.rayconnect.storage.setItem<T>(this.NAME, value);
    }

    public async get(): Promise<T | null> {
        return this.rayconnect.storage.getItem(this.NAME);
    }

    public async unset(): Promise<void> {
        await this.rayconnect.storage.removeItem(this.NAME);
    }

    public async isEmpty(): Promise<boolean> {
        return !await this.rayconnect.storage.hasItem(this.NAME);
    }

    public async is(value: T): Promise<boolean> {
        let result = await this.get();
        if (!result) return false;
        else return result == value;
    }
}