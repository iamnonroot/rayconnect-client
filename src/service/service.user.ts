import { Rayconnect } from "../index";
import { IUser } from "../interface";

export class UserService {
    constructor(private rayconnect: Rayconnect) { }

    get id(): string | undefined {
        return this.rayconnect.client.user ? this.rayconnect.client.user['uid'] : undefined;
    }

    get profile(): any | undefined {
        return this.rayconnect.client.user ? this.rayconnect.client.user['profile'] : undefined;
    }

    set profile(data: any) {
        this.setProfile(data);
    }

    public async setProfile(data: any): Promise<void> {
        try {
            if (this.rayconnect.options.mode == 'socket') {
                await this.rayconnect.client.setProfile(data);
            } else {
                let res = await this.rayconnect.http.request({
                    path: 'profile',
                    method: 'POST',
                    data: data
                });

                console.log(res);

            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async loadProfile(): Promise<IUser> {
        try {
            let res = await this.rayconnect.http.request<{ uid: string, profile: { data: object } }>({
                path: 'me',
                method: 'GET'
            });

            if (res.status == true) {
                this.rayconnect.client.user = {
                    'uid': res.body.uid,
                    'profile': res.body.profile.data,
                };
                return { id: res.body.uid, profile: res.body.profile.data };
            } else {
                return Promise.reject("Profile not found!");
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}