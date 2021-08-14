import Rayconnect from "rayconnect-client";

export class UserService {
    constructor(private rayconnect: Rayconnect) { }

    get id(): string | undefined {
        return this.rayconnect.user ? this.rayconnect.user['uid'] : undefined;
    }

    get profile(): any | undefined {
        return this.rayconnect.user ? this.rayconnect.user['profile'] : undefined;
    }

    set profile(data: any) {
        this.rayconnect.setProfile(data);
    }
}