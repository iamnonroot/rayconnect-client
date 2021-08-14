import Rayconnect from "rayconnect-client";
import { UsernameAndPassword } from "../interface/service.auth";

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

    public getToken(): string | null | undefined {
        return window.localStorage.getItem('rayconnect-token');
    }

    public setToken(token: string): void {
        window.localStorage.setItem('rayconnect-token', token);
    }

    public async asGuest(): Promise<void> {
        let result = await this.rayconnect.Guest(),
            token = result['data']['token'];

        await this.from(token);
    }

    public async from(token: string): Promise<void> {
        await this.rayconnect.Auth(token);
    }

    public async with(data: UsernameAndPassword): Promise<boolean> {
        try {
            let res = await this.rayconnect.LoginWithPassword({ username: data.username, password: data.password });
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
        await this.rayconnect.RequestOTP(phone);
    }

    public async verify(phone: string, code: string): Promise<boolean> {
        try {
            let result: any = await this.rayconnect.VerifyPhone(phone, code);
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
        return await this.rayconnect.isAuth() as boolean;
    }
}