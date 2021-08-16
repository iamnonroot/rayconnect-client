import { IQueryOption } from "../interface/query";

export function Query(options: IQueryOption) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class Query extends constructor {
            OPTIONS: IQueryOption = options;
        }
    }
}