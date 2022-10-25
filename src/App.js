import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from "./routes/index.routes";
import {requestUserPermission, notificationListener, getFCMToken} from './utils/pushNotificationHelper';

const App = () => {

    useEffect(()=>{
        requestUserPermission();
        notificationListener();
        getFCMToken();
    },[])

  return (
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
  );
};

export default App;
