import { Rayconnect } from "../index";

export class UserService {
    constructor(private rayconnect: Rayconnect) { }

    get id(): string | undefined {
        return this.rayconnect.client.user ? this.rayconnect.client.user['uid'] : undefined;
    }

    get profile(): any | undefined {
        return this.rayconnect.client.user ? this.rayconnect.client.user['profile'] : undefined;
    }

    set profile(data: any) {
        this.rayconnect.client.setProfile(data);
    }
}