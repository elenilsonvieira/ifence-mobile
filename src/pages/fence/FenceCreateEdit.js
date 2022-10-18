import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import {fenceStyles} from './fenceStyles';

function FenceCreateEdit(props) {
  const fenceService = new FenceService();

  const [fence, setFence] = useState();

  const [name, setName] = useState('');
  const [radius, setRadius] = useState(0.0);
  const [coordinate, setCoordinate] = useState();
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  useEffect(() => {
      if(props.route.params.item){
          setFence(props.route.params.item);
          setName(props.route.params.item.name);
          setCoordinate(props.route.params.item.coordinate);
          setLatitude(props.route.params.item.coordinate.latitude);
          setLongitude(props.route.params.item.coordinate.longitude);
          setStartTime(props.route.params.item.startTime);
          setEndTime(props.route.params.item.endTime);
      }
  }, [props]);

  const onPressHandler = () => {
      const fenc = {
          id: fence ? fence.id : undefined,
          name: name,
          coordinate: {
              latitude: latitude,
              longitude: longitude
          },
          startTime: startTime,
          endTime: endTime,
          radius: radius
      };

      try {
          if (fence) {
              updateFence(fenc);
          } else {
              createFence(fenc);
          }
          props.navigation.goBack();
      } catch (error) {
          console.log(error);
      }

    createFence();
    setName('');
    setLatitude(0.0)
    setLongitude(0.0)
    setRadius(0.0)
    setStartTime('12:00')
    setEndTime('18:00')
  };

  const createFence = async (fenc) => {
/*
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
*/

    await fenceService.create(fenc)
      .then( response =>
        {
            console.log("Response " + response.data.content);
        }
    ).catch( error => {
      console.log(error.response);
    });
  }

    const updateFence = async (fenc) => {
        /*
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
        */

        await fenceService.update(fenc.id, fenc)
            .then( response =>
                {
                    console.log("Response " + response.data.content);
                }
            ).catch( error => {
                console.log(error.response);
            });
    }


    return (
      <View style={fenceStyles.container}>
          <Text style={fenceStyles.title}>
              {fence ? "Edição de cerca" : "Criação de cerca"}
          </Text>
          <View style={fenceStyles.body}>
              <View style={fenceStyles.register}>
                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Nome da cerca"
                      onChangeText={value => setName(value)}
                      value={name}
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Latitude"
                      onChangeText={value => setLatitude(value)}
                      value={latitude}
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Longitude"
                      onChangeText={value => setLongitude(value)}
                      value={longitude}
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Raio"
                      onChangeText={value => setRadius(value)}
                      value={radius}
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="12:00"
                      onChangeText={value => setStartTime(value)}
                      value={startTime}
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="18:00"
                      onChangeText={value => setEndTime(value)}
                      value={endTime}
                  />
                  <TouchableOpacity style={fenceStyles.button} onPress={onPressHandler}>
                      <Text style={fenceStyles.text}>{fence ? "SALVAR" : "REGISTRAR"}</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </View>



  );
}

export default FenceCreateEdit;
