import axios from "axios";
import { Rayconnect } from "..";
import { HttpRequestOption, HttpRequestResponse } from "../interface";

export class HttpService {
    constructor(private rayconnect: Rayconnect) { }

    public async request<T>(option: HttpRequestOption): Promise<HttpRequestResponse<T>> {
        try {
            let { aid, endpoint } = this.rayconnect.options;
            let version: 'v1' | 'v2' = !option.version ? 'v2' : option.version;

            let url = endpoint?.http![version];

            if (!url) return Promise.reject("Http endpoints are undefinded!");

            let headers: any = {
                'content-type': 'application/json',
                'aid': aid,
            };

            if (option.auth == null || option.auth == true) {
                let token = await this.rayconnect.auth.getToken();
                if (!token) return Promise.reject('Token needed to request this query with http!');
                else headers['token'] = token;
            }

            let body: any = {
                scope: option.scope,
                method: option.method,
                address: option.address,
                data: option.data,
            };

            if (!option.scope && !option.address) body = option.data;

            if(option.path == 'run') option.method = 'POST';

            let res = await axios({
                url: `https://${url}/${option.path}?aid=${aid}`,
                method: option.method == 'GET'? 'GET' : 'POST',
                headers: headers,
                data: body,
            });
            return { status: res.data['status'] ? res.data['status'] : res.status == 200, body: res.data['data'] ? res.data['data'] : res.data, at: res.data['date'] ? res.data['date']['unix'] : Date.now(), user: res.data['sender'], token: res.data['token'] };
        } catch (error) {            
            if (error.response.status) {
                return Promise.reject(error.response.status);
            }
            return Promise.reject(error);
        }
    }
}