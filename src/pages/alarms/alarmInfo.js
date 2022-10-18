import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import alarmStyles from './alarmStyles';


function AlarmInfo(props) {
    const [alarm, setAlarm] = useState();

    useEffect(() => {
        setAlarm(props.route.params.item);
    }, [props])
    
    return (
      <View style={alarmStyles.container}>
          <Text style={alarmStyles.title}>Descrição do Alarme</Text>
          <Text style={alarmStyles.itemInfo}>Cerca: {alarm ? alarm.fence.name : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Pulseira: {alarm ? alarm.location.bracelet.name : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Distância da cerca: {alarm ? alarm.distance : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Distância excedida: {alarm ? alarm.exceeded : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Latitude da pulseira: {alarm ? alarm.location.coordinate.latitude : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Longitude da pulseira: {alarm ? alarm.location.coordinate.longitude : ''}</Text>
          <Text style={alarmStyles.itemInfo}>Data de criação: {alarm ? alarm.location.creationDate : ''}</Text>
      </View>
    );
}

export default AlarmInfo;