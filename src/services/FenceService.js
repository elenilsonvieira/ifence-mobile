
import ApiService from "./config/ApiService";

export default class FenceService extends ApiService {

    constructor(){
        super('/fences');
    }

    create(object){
        return this.post('', object);
    }

    update(id, object){
        return this.put(`/${id}`, object);
    }

    statusActive(id, object){
        return this.patch(`/${id}/setStatus`, null, object);
    }

    delete(id){
        return super.delete(`/${id}`);
    }

    findById(id){
        return this.get(`/${id}`);
    }

    find(params){
        return this.get(`${params}`);
    }

    search(params){
        return this.get(`/search`, params);
    }

    find(config){
        return this.get('', config);
    }

    findAll(){
        return this.get();
    }

}
