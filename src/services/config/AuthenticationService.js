import ApiService, {LOGGED_USER, TOKEN} from "./ApiService";
import StorageService from "./StorageService";

export default class AuthenticationService extends ApiService {

    constructor(){
        super('');
        this.storageService = new StorageService();
    }

    async login(username, password){
        const loginDTO = {
            "username": username,
            "password": password
        };

        try{
            const response = await this.post('/login', loginDTO);

            const user = response.data.user;
            const token = response.data.token;

            this.storageService.setItem(LOGGED_USER, user);
            this.storageService.setItem(TOKEN, token);

            this.registerToken(token);
            return user;
        } catch(error){
            return null;
        }
    }

    isValidToken(token){
        return this.post('/isValidToken', token);
    }

    logout(){
        this.storageService.removeItem(LOGGED_USER);
        this.storageService.removeItem(TOKEN);

        return this.post('/logout');
    }

    getLoggedUser(){
        return this.storageService.getItem(LOGGED_USER);
    }

    getToken(){
        return this.storageService.getItem(TOKEN);
    }

    async isAuthenticated(){
        const user = await this.getLoggedUser();
        const token = await this.getToken();
        
        console.log("Token: " + token);
        if(!user || !token){
            return false;
        }

        const tokenDTO = {
            "token": token
        };

        try {
            const response = await this.isValidToken(tokenDTO);
            return response.data.valid;
        } catch (error) {
            return false;
        }
    }

}