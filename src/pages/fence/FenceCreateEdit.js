import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import {fenceStyles} from './fenceStyles';

function FenceCreateEdit(props) {
  const fenceService = new FenceService();

  const [fence, setFence] = useState();

  const [name, setName] = useState('');
  const [radius, setRadius] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [startTime, setStartTime] = useState('');
  const [finishTime, setfinishTime] = useState('');

  useEffect(() => {
      if(props.route.params.item){
          setFence(props.route.params.item);
          setName(props.route.params.item.name);
          setLatitude(props.route.params.item.coordinate.latitude);
          setLongitude(props.route.params.item.coordinate.longitude);
          setStartTime(props.route.params.item.startTime);
          setfinishTime(props.route.params.item.finishTime);
          setRadius(props.route.params.item.radius);
      }
  }, [props]);

  const onPressHandler = async () => {
      const fenc = {
          id: fence ? fence.id : undefined,
          name: name,
          coordinate: {
              latitude: latitude,
              longitude: longitude
          },
          startTime: startTime,
          finishTime: finishTime,
          radius: radius
      };

      try {
          if (fence) {
                await fenceService.update(fenc.id, fenc);
            } else {
                await fenceService.create(fenc);
          }
          props.navigation.goBack();
      } catch (error) {
          console.log(error);
      }
    };

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
                      placeholderTextColor="#808080" 
                      onChangeText={value => setName(value)}
                      value={name}
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Latitude"
                      placeholderTextColor="#808080" 
                      onChangeText={value => setLatitude(value)}
                      value={latitude}
                      
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Longitude"
                      placeholderTextColor="#808080" 
                      onChangeText={value => setLongitude(value)}
                      value={longitude}
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="Raio"
                      placeholderTextColor="#808080" 
                      onChangeText={value => setRadius(value)}
                      value={radius}
                      keyboardType='numeric'
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="12:00"
                      placeholderTextColor="#808080" 
                      onChangeText={value => setStartTime(value)}
                      value={startTime}
                  />

                  <TextInput
                      style={fenceStyles.input}
                      placeholder="18:00"
                      placeholderTextColor="#808080" 
                      onChangeText={value => setfinishTime(value)}
                      value={finishTime}
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
