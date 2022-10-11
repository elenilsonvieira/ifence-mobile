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
import FenceService from '../../services/FenceService';
import AuthenticationService from '../../services/config/AuthenticationService';

const Fences = () => {
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

  const listFences = () => {
    return (
      <FlatList
        data={fences}
        renderItem={({item}) => (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.item} key={item.id}>
              <Text style={styles.text_item}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFence(item)}>
              <Text style={styles.text}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  const firstBracelet = () => {
    return (
      <View style={styles.register}>
        <Text style={styles.text}>Cadastre a primeira cerca:</Text>
      </View>
    );
  };

  const formRegisterFence = () => {
    return (
      <View style={styles.register}>
        <TextInput
          style={styles.input}
          placeholder="Nome da cerca"
          onChangeText={value => setText(value)}
          value={text}
        />

        <TextInput
            style={styles.input}
            placeholder="Latitude"
            onChangeText={value => setLatitude(value)}
            value={latitude}
            keyboardType='numeric'
        />

        <TextInput
            style={styles.input}
            placeholder="Longitude"
            onChangeText={value => setLongitude(value)}
            value={longitude}
            keyboardType='numeric'
        />

        <TextInput
            style={styles.input}
            placeholder="Raio"
            onChangeText={value => setRadius(value)}
            value={radius}
            keyboardType='numeric'
        />

        <TextInput
            style={styles.input}
            placeholder="12:00"
            onChangeText={value => setStartTime(value)}
            value={startTime}
        />

        <TextInput
            style={styles.input}
            placeholder="18:00"
            onChangeText={value => setEndTime(value)}
            value={endTime}
        />
        <TouchableOpacity style={styles.button} onPress={onPressHandler}>
          <Text style={styles.text}>Registrar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const logoutButton = () => {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const logout = () => {
    const auth = new AuthenticationService();

    auth.logout();
  }

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Lista de cercas</Text>
      </View>
      <View style={styles.body}>
        {fences.length > 0 ? listFences() : firstBracelet()}
        {formRegisterFence()}
        {logoutButton()}
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


export default Fences;
