import { KeyValue } from "../interface/service.storage";
import { IStorageOptions } from "../interface/storage";
import { Rayconnect } from "../index";

export function Storage(options: IStorageOptions) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class Storage extends constructor {
            STORAGE_NAME: string = options.name;
        }
    }
}

export class ofSimple {
    constructor(protected rayconnect: Rayconnect) { }

    protected get NAME(): string {
        return (this as any)['STORAGE_NAME'];
    }
}

export class ofLoadAndSave<T> extends ofSimple {
    public items: T[] = [];

    constructor(protected rayconnect: Rayconnect) {
        super(rayconnect);
        setTimeout(() => {
            this.load();
        }, 0);
    }

    public async load(): Promise<void> {
        try {
            if (this.NAME == undefined) return;
            let res = await this.rayconnect.storage.getItem<T[]>(this.NAME);
            if (res) this.items = res.value;
        } catch (error) {
            this.items = [];
        }
    }

    public async save(): Promise<void> {
        try {
            await this.rayconnect.storage.setItem(this.NAME, this.items);
        } catch (error) {
        }
    }
}

export class ofSetAndGet<T> extends ofSimple {
    public async setItem(value: T): Promise<void> {
        await this.rayconnect.storage.setItem<T>(this.NAME, value);
    }

    public async getItem(): Promise<KeyValue<T> | null> {
        return this.rayconnect.storage.getItem(this.NAME);
    }

    public async removeItem(): Promise<void> {
        await this.rayconnect.storage.removeItem(this.NAME);
    }

    public async hasItem(): Promise<boolean> {
        return await this.rayconnect.storage.hasItem(this.NAME);
    }
}