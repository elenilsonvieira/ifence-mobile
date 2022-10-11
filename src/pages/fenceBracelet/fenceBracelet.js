import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FenceBraceletService from '../../services/FenceBraceletService';
import FenceService from '../../services/FenceService';

const FenceBracelet = () => {
  const fenceBraceletService = new FenceBraceletService();
  const fenceService = new FenceService();

  const [fenceID, setFenceID] = useState();
  const [braceletID, setBraceletID] = useState();

  const onPressHandler = () => {
    registerFenceBracelet();
    setFenceID();
    setBraceletID();
  };

  const registerFenceBracelet = async () => {
    const fenceBracelet = {
      fenceId: fenceID,
      braceletId: braceletID
    };

    fenceBraceletService.save(fenceBracelet)
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
      <View style={styles.register}>
        <TextInput
          style={styles.input}
          placeholder="ID da cerca"
          onChangeText={value => setFenceID(value)}
          value={fenceID}
          keyboardType='numeric'
        />

        <TextInput
            style={styles.input}
            placeholder="ID da pulseira"
            onChangeText={value => setBraceletID(value)}
            value={braceletID}
            keyboardType='numeric'
        />

        <TouchableOpacity style={styles.button} onPress={onPressHandler}>
          <Text style={styles.text}>Registrar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Cercas e pulseiras</Text>
      </View>
      <View style={styles.body}>
        {formRegisterFence()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  register: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#00ff00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  item: {
    flex: 3,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_header: {
    color: '#000000',
    fontSize: 35,
    fontStyle: 'italic',
    margin: 10,
  },
  text: {
    color: '#000000',
    fontSize: 20,
    margin: 10,
  },
  text_item: {
    color: '#000000',
    fontSize: 35,
    margin: 5,
  },
  input: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: '#00ff00',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  deleteButton: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#037272',
    padding: 10,
    borderRadius: 8,
  },
});


export default FenceBracelet;
