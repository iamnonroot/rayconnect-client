import { Rayconnect } from "../index";
import { AuthEvents, IAuthCallback, IAuthEvent, UsernameAndPassword } from "../interface/service.auth";

let callback: IAuthCallback;
let event: IAuthEvent = {};

export class AuthService {

    constructor(private rayconnect: Rayconnect) { }

    public async init(): Promise<boolean> {
        let token = this.getToken();
        if (token) {
            await this.from(token);
            return true;
        }
        return false;
    }
    private on(name: AuthEvents, callback: Function): void {
        (event as any)[name] = callback;
    }

    public event(callback: Function): void {
        this.on('auth', callback);
    }

    public setCallback(functions: IAuthCallback): void {
        callback = functions;
    }

    public getToken(): string | null | undefined {
        return callback && callback.getToken ? callback.getToken() : window != undefined ? window.localStorage.getItem('rayconnect-token') : null;
    }

    public setToken(token: string): void {
        callback && callback.setToken ? callback.setToken(token) : window != undefined ? window.localStorage.setItem('rayconnect-token', token) : null;
    }

    public async asGuest(): Promise<void> {
        let result = await this.rayconnect.client.Guest(),
            token = result['data']['token'];

        await this.from(token);
    }

    public async from(token: string): Promise<void> {
        await this.rayconnect.client.Auth(token);
        if (event['auth']) event['auth']();
    }

    public async with(input: UsernameAndPassword): Promise<boolean> {
        try {
            let res = await this.rayconnect.client.LoginWithPassword({ username: input.username, password: input.password });
            if (res['status'] == false) return false;
            else {
                let token = res['data']['token'];
                this.setToken(token);
                await this.from(token);
                return true;
            }
        } catch (error) {
            return Promise.reject(false);
        }
    }

    public async send(phone: string): Promise<void> {
        await this.rayconnect.client.RequestOTP(phone);
    }

    public async verify(phone: string, code: string): Promise<boolean> {
        try {
            let result: any = await this.rayconnect.client.VerifyPhone(phone, code);
            if (result['status'] == false) return false;
            else {
                let token: string = result['data']['token'];
                await this.setToken(token);
                await this.from(token);
                return true;
            }
        } catch (error) {
            return Promise.reject(false);
        }
    }

    public async ed(): Promise<boolean> {
        return await this.rayconnect.client.isAuth() as boolean;
    }
}