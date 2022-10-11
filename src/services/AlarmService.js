import ApiService from "./config/ApiService";

export default class AlarmService extends ApiService {

    constructor(){
        super('/alarms');
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

    seenAlarm(id){
        return this.patch(`/${id}`);
    }

    findHistoryByPeriod(params){
        return this.get('/period', params);
    }

    findHistoryByBracelet(params){
        return this.get('/bracelet', params);
    }

    findAll(){
        return this.get();
    }

}