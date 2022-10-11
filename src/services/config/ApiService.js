import axios from "axios";

import StorageService from "./StorageService";

export const LOGGED_USER = 'loggedUser';
export const TOKEN = 'token';

export const httpClient = axios.create({
    baseURL: "https://ifence-api.herokuapp.com/api",
    withCredentials: true,
});

export default class ApiService {

    constructor(endpoint){
        this.endpoint = endpoint;

        this.storageService = new StorageService();
        this.registerToken();
    }

    async registerToken(){
        const token = await this.storageService.getItem(TOKEN);
        if(token){
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }

    post(url, params){
        url = this.buildUrl(url);
        return httpClient.post(url, params);
    }
    post(url, body, params){
        url = this.buildUrl(url);
        return httpClient.post(url, body, {params: params});
    }

    put(url, params){
        url = this.buildUrl(url);
        return httpClient.put(url, params);
    }

    delete(url){
        url = this.buildUrl(url);
        return httpClient.delete(url);
    }

    patch(url){
        url = this.buildUrl(url);
        return httpClient.patch(url);
    }

    get(url){
        url = this.buildUrl(url);
        return httpClient.get(url);
    }

    get(url, params){
        url = this.buildUrl(url);
        return httpClient.get(url, {params: params});
    }

    buildUrl(url){
        if (url) {
            return `${this.endpoint}${url}`;
        } else {
            return `${this.endpoint}`;
        }
    }

}
