import ApiService from "./config/ApiService";

export default class FenceBraceletService extends ApiService{
    constructor(){
        super('/fences');
    }

    save(config){
        return this.post('/registerBracelet', {}, config);
    }

    delete(config){
        return super.delete('/removeBracelet', config);
    }
}
