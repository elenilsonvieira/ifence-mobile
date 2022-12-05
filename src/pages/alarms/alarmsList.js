import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Hearder from '../../components/header/header';
import SelectBracelet from '../../components/select-bracelet/select-bracelet';
import AlarmService from '../../services/AlarmService';
import { convertDateToString } from '../../utils/DateUtil';

import alarmStyles from './alarmStyles';

function AlarmsList(props) {
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

    const findAlarmNotSeen = () => {
        let alarms = 0;
        alarmList.map((item) => {
            if (item.seen == false) {
                alarms++;
            }
        })
        return alarms;
    }

    return (
        <View style={alarmStyles.container}>
            <Hearder title={findAlarmNotSeen() == 0 ? 'Você não possui novos alarmes' : `Você possui ${findAlarmNotSeen()} alarmes novos`}/>
            <View style={alarmStyles.container}>
                <FlatList
                    data={alarmList}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={ () => navigateToAlarmPage(item)}>
                            <View style={alarmStyles.itemList} key={item.id}>
                                <Text style={[alarmStyles.row, item.seen ? alarmStyles.alarmSeen : alarmStyles.alarmNotSeen]}>{item.location.bracelet.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

export default AlarmsList;