import messaging, {firebase} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

async function onAppBoostrap() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log(token);

    // Save the token
    // await postToApi('/users/1234/tokens', { token });
}

export async function getFCMToken() {
    let FCMToken = await AsyncStorage.getItem("FCMToken");
    console.log(FCMToken, "old token");

    if (!FCMToken){
        try {
            const FCMToken = await messaging().getToken();
            if (FCMToken){
                console.log(FCMToken, "new token");
                await AsyncStorage.setItem('FCMToken', FCMToken);
            }
        } catch (error) {
            console.log(error, "erro no FCMToken");
        }
    }
}

export const notificationListener = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        // navigation.navigate(remoteMessage.data.type);
    });
    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });
    messaging().onMessage(async remoteMessage => {
        Alert.alert('Alerta chegou', 'Chegou um alerta do FCM', [{
            text: "OK",
        }]);
        // console.log("notification on foreground state ...", remoteMessage);
    })
}