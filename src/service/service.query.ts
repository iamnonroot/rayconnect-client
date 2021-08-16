import { ServerData } from "rayconnect-client/dist/core/types";
import { Rayconnect } from "../index";
import { BackQuery, ExecQuery, ExecQueryResponse, OnQuery, OnQueryCallback, SendQuery } from "../interface";
import { IQueryOption, IQueryRequest, IQueryResponse } from "../interface/query";

type QueryOf<T> = new (...args: any[]) => T;

export class QueryService {
    constructor(private rayconnect: Rayconnect) { }

    private queryBackOf(req: ServerData): BackQuery {
        let request: IQueryRequest<any> = {
            body: req.data,
            user: req.sender,
            token: req.token || '*',
            at: req.date.unix || Date.now()
        };
        let response: IQueryResponse = {
            send: (data) => req.send!(data),
        }
        return { request, response };
    }

    public hasScope(scope: string): boolean {
        return this.rayconnect.options.scopes.includes(scope);
    }

    public async setPermission(option: IQueryOption): Promise<void> {
        try {
            await this.rayconnect.client.changePermissions({
                uid: option.access || 'guest',
                mode: 'add',
                scope: option.scope,
                method: option.method,
                address: option.address,
            });
            return Promise.resolve();
        } catch (error) {

            return Promise.reject();
        }
    }

    public async of<T>(query: QueryOf<T>): Promise<void> {
        let item: any = new query();
        if ('run' in item) {
            let options: IQueryOption = item.OPTIONS;
            await this.setPermission(options);
            this.on({
                scope: options.scope,
                method: options.method,
                address: options.address
            }, item.run);
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    }

    public on(option: OnQuery, callback: OnQueryCallback): void {
        if (this.hasScope(option.scope) == false) {
            let sceops = [...this.rayconnect.options.scopes];
            sceops.push(option.scope);
            let error = `Put "${option.scope}" to your scopes when you listen for "${option.address}" as your address and "${option.method}" as your method when you make a new Rayconnect.\n\nnew Rayconnect({ \n\t...\n\tscopes: [${sceops.map(item => `"${item}"`).join(',')}],\n\t...\n });`;
            console.error(error);
        } else {

            this.rayconnect.client.Query({
                scope: option.scope,
                method: option.method,
                address: option.address,
            }, (req) => {
                let { request, response } = this.queryBackOf(req);
                callback(request, response);
            });
        }
    }

    public send(option: SendQuery): void {
        let execQueryOption: any = {
            scope: option.scope,
            address: option.address,
            info: {
                method: option.method,
                data: option.data
            }
        };

        if (option.user) execQueryOption['uniqueID'] = option.user;
        if (option.token) execQueryOption['TokenID'] = option.token;

        this.rayconnect.client.execQuery(execQueryOption);
    }

    public async exec<T>(option: ExecQuery): Promise<ExecQueryResponse<T>> {
        let runQueryOption: any = {
            scope: option.scope,
            method: option.method,
            address: option.address,
            data: option.data
        }

        if (option.user) runQueryOption['user'] = option.user;
        if (option.token) runQueryOption['token'] = option.token;
        try {
            let res = await this.rayconnect.client.Run(runQueryOption);
            return { body: res['data'], user: res.sender, token: res.token || '*', at: res.date.unix || Date.now() };
        } catch (error) {
            return Promise.reject(error);
        }

    }
}