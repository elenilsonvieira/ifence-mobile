import React, {useEffect} from 'react';
import Routes from "./routes/index.routes";
import {requestUserPermission, notificationListener, getFCMToken} from './utils/pushNotificationHelper';
import AuthProvider from './context/Auth';

const App = () => {

    useEffect(()=>{
        requestUserPermission();
        notificationListener();
        getFCMToken();
    },[])

  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  );
};

export default App;
