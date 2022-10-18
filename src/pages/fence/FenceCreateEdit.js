import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import {fenceStyles} from './fenceStyles';

const FenceCreateEdit = () => {
  const fenceService = new FenceService();

  const [fence, setFence] = useState();

  const [text, setText] = useState('');
  const [radius, setRadius] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const onPressHandler = () => {
    registerFences();
    setText('');
    setLatitude(0.0)
    setLongitude(0.0)
    setRadius(0.0)
    setStartTime('12:00')
    setEndTime('18:00')
  };

  const registerFences = async () => {
    const fence = {
      name: text,
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

  const formRegisterFence = () => {
    return (
      <View style={fenceStyles.register}>
        <TextInput
          style={fenceStyles.input}
          placeholder="Nome da cerca"
          onChangeText={value => setText(value)}
          value={text}
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
          <Text style={fenceStyles.text}>Registrar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
      <View style={fenceStyles.container}>
          <Text style={fenceStyles.title}>
              {fence ? "Edição de cerca" : "Criação de cerca"}
          </Text>
          <View style={fenceStyles.body}>
              {formRegisterFence()}
          </View>
      </View>



  );
}

export default FenceCreateEdit;
