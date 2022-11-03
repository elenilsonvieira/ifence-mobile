import { PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";

const Coords = {
    requestLocationPermission: async () => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Permissão de localização",
                message: "Precisamos acessar sua localização?",
                buttonNeutral: "Pergunte-me mais tarde",
                buttonNegative: "Cancelar",
                buttonPositive: "OK",
            }
            );
            if (granted === "granted") {
            return true;
            } else {
            return false;
            }
        } catch (error) {
            return false;
        }
    },
  getLocation: async (successCallback, errorCallback) => {
    const res = await Coords.requestLocationPermission();

    if (res) {
        Geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    } else {
        errorCallback
    }
  },
  watchLocation: async (successCallback, errorCallback) => {
    const res = await Coords.requestLocationPermission();

    if (res) {
        const watchID = Geolocation.watchPosition(
            successCallback,
            errorCallback,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        return watchID;
    } else {
        errorCallback
    }
  },
  cleanWatchLocation: async (watchID) => {
    const res = await Coords.requestLocationPermission();
    if (res) {
        Geolocation.clearWatch(watchID);
    }
  }
}

export default Coords;