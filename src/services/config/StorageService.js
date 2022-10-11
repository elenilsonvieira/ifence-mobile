import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StorageService {
    
    async setItem(key, value){
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
          } catch (e) {
            // saving error
          }
    }

    async getItem(key){
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    async removeItem(key){
        try {
            await AsyncStorage.removeItem(key)
        } catch(e) {
            // remove error
        }
    }
}