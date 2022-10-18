import React, {useEffect, useState} from 'react';
import {Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import formRegisterFence from './FenceCreateEdit';
import {fenceStyles} from './fenceStyles';
import FloatingButton from '../../components/floating-button/floating-button';

const FencesList = ({navigation}) => {
  const fenceService = new FenceService();

  const [text, setText] = useState('');
  const [radius, setRadius] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('18:00');

  const [fences, setFences] = useState([]);

  useEffect(() => {
    getFences();
  }, []);

/*
  const onPressHandler = () => {
    registerFences();
    setText('');
    setLatitude(0.0)
    setLongitude(0.0)
    setRadius(0.0)
    setStartTime('12:00')
    setEndTime('18:00')
    //setBracelets([...bracelets, bracelet]);

    getFences();
  };
*/

  const getFences = () => {
    fenceService.findAll()
      .then(response => {
        setFences(response.data.content);
      }).catch( error => {
        console.log(error);
      });
  };
  const registerFences = async () => {
    const fence = {
      name: name,
      coordinate: {
        latitude: latitude,
        longitude: longitude
      },
      startTime: startTime,
      endTime: endTime,
      radius: radius
    };

    fenceService.create(fence)
      .then( response =>
        {
            console.log("Response " + response.data.content);
        }
    ).catch( error => {
      console.log(error.response);
    });
  }

  const deleteFence = item => {
    Alert.alert('Cuidado', `Gostaria de excluir a cerca ${item.name}?`, [
      {text: 'Cancelar'},
      {
        text: 'Excluir',
        onPress: () => {
          // eslint-disable-next-line no-shadow
          fenceService.delete(item.id);
          setFences(fences => {
            return fences.filter((value, index) => value !== item);
          });
        },
      },
    ]);
  };

    function onPressHandler(item) {
        navigation.navigate("fenceCreatEdit", {
            item: item,
        });
    }


    const listFences = () => {
    return (
      <FlatList
        data={fences}
        renderItem={({item}) => (
          // eslint-disable-next-line react-native/no-inline-fenceStyles
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={fenceStyles.item} key={item.id}>
              <Text style={fenceStyles.text_item}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={fenceStyles.deleteButton}
              onPress={() => deleteFence(item)}>
              <Text style={fenceStyles.text}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

    return (
        <View style={fenceStyles.body}>
            <View style={fenceStyles.header}>
                <Text style={fenceStyles.text_header}>Lista de cercas</Text>
            </View>
            <View style={fenceStyles.body}>
                {listFences()}
                <FloatingButton
                    onPress={() => onPressHandler()}
                />
            </View>
        </View>
    );
};


export default FencesList;
