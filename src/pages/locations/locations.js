import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import Hearder from '../../components/header/header';
import SelectBracelet from '../../components/select-bracelet/select-bracelet';
import LocationService from '../../services/LocationService';
import { convertDateToString } from '../../utils/DateUtil';

import styles from './styles';

function Locations() {
  const locationService = new LocationService();

  const [locationList, setLocationList] = useState([]);
  const [selected, setSelected] = useState();

  useEffect(() => {
      getAll();
  }, [])

  const getAll = () => {
    if (selected) {
      const request = {
        id: selected, 
        sort: "creationDate,DESC"
      }
      locationService.findHistoryByBracelet(request)
          .then((response) => {
              console.log(response.data.content);
              setLocationList(response.data.content);
          }).catch((error) => {
              console.log(error);
          });
    } else {
      var today = new Date();
      var priorDate = new Date(new Date().setDate(today.getDate() - 30));

      const request = {
          startDate: convertDateToString(priorDate),
          endDate: convertDateToString(today),
          sort: "creationDate,DESC"
      }
      locationService.findHistoryByPeriod(request)
          .then((response) => {
              setLocationList(response.data.content);
          }).catch((error) => {
              console.log(error);
          });
    }
  }

    return (
      <View style={styles.container}>
        <Hearder title={'Estas são as últimas posições registradas'}/>
        <View style={styles.container}>
          <View style={styles.listWrapper}>
              <Text style={[styles.row, styles.title]}>Pulseira</Text>
              <Text style={[styles.row, styles.title]}>Latitude</Text>
              <Text style={[styles.row, styles.title]}>Longitude</Text>
          </View>
          <FlatList
              data={locationList}
              renderItem={({item}) => (
                  <View style={styles.listWrapper} key={item.id}>
                      <Text style={styles.row}>{item.bracelet.name}</Text>
                      <Text style={styles.row}>{item.coordinate.latitude}</Text>
                      <Text style={styles.row}>{item.coordinate.longitude}</Text>
                  </View>
              )}
          />
        </View>
      </View>
    );
}

export default Locations;