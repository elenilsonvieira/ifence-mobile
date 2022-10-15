import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';

import styles from './styles';


function Alarm(props) {
    const [alarm, setAlarm] = useState();

    useEffect(() => {
        setAlarm(props.route.params.item);
    }, [props])
    
    return (
      <View style={styles.container}>
          <Text style={styles.title}>Descrição do Alarme</Text>
          <Text style={styles.item}>Cerca: {alarm ? alarm.fence.name : ''}</Text>
          <Text style={styles.item}>Pulseira: {alarm ? alarm.location.bracelet.name : ''}</Text>
          <Text style={styles.item}>Distância da cerca: {alarm ? alarm.distance : ''}</Text>
          <Text style={styles.item}>Distância excedida: {alarm ? alarm.exceeded : ''}</Text>
          <Text style={styles.item}>Latitude da pulseira: {alarm ? alarm.location.coordinate.latitude : ''}</Text>
          <Text style={styles.item}>Longitude da pulseira: {alarm ? alarm.location.coordinate.longitude : ''}</Text>
          <Text style={styles.item}>Data de criação: {alarm ? alarm.location.creationDate : ''}</Text>
      </View>
    );
}

export default Alarm;