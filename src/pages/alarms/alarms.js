import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectBracelet from '../../components/select-bracelet/select-bracelet';
import AlarmService from '../../services/AlarmService';
import { convertDateToString } from '../../utils/DateUtil';

import styles from './styles';

function Alarms(props) {
    const alarmService = new AlarmService();

    const [alarmList, setAlarmList] = useState([]);
    const [selected, setSelected] = useState();

    useEffect(() => {
        getAll();
    }, [])

    const getAll = () => {
        if (!selected) {
            var today = new Date();
            var priorDate = new Date(new Date().setDate(today.getDate() - 30));
    
            const request = {
                startDate: convertDateToString(priorDate),
                endDate: convertDateToString(today),
                sort: "location.creationDate,DESC"
            }
            alarmService.findHistoryByPeriod(request)
                .then((response) => {
                    setAlarmList(response.data.content);
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            const request = {
                id: selected, 
                sort: "location.creationDate,DESC"
            }
            alarmService.findHistoryByBracelet(request)
                .then((response) => {
                    console.log(response.data.content);
                    setAlarmList(response.data.content);
                }).catch((error) => {
                    console.log(error);
                });
        }
    }

    function navigateToAlarmPage(alarm) {
        if (!alarm.seen) {
            alarmService.seenAlarm(alarm.id)
            .then(() => {
                getAll();
            }).catch((error) => {
                console.log(error);
            });
        }
        props.navigation.navigate(
          'alarm', 
          {
            item: alarm,
          }
        )
    }

    return (
        <View style={styles.container}>
            <SelectBracelet
                setSelected={setSelected}
                onSelect={getAll}
            />
            <FlatList
                data={alarmList}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={ () => navigateToAlarmPage(item)}>
                        <View style={styles.item} key={item.id}>
                            <Text style={[styles.row, item.seen ? styles.alarmSeen : styles.alarmNotSeen]}>{item.location.bracelet.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Alarms;