import ApiService from "./config/ApiService";

export default class UserService extends ApiService {

    constructor(){
        super('/users');
    }

    create(object){
        return this.post('', object);
    }

    update(object){
        return this.put(``, object);
    }

    delete(id){
        return super.delete(`/user`);
    }
}