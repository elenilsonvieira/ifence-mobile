
import ApiService from "./config/ApiService";

export default class BraceletService extends ApiService {

    constructor(){
        super('/bracelets');
    }

    create(object){
        return this.post('', object);
    }

    update(id, object){
        return this.put(`/${id}`, object);
    }

    delete(id){
        return super.delete(`/${id}`);
    }

    find(params){
        return this.get(`${params}`);
    }
    
    search(params){
        return this.get(`/search`, params);
    }

    findAll(){
        return this.get();
    }

}