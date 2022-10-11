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
import AuthenticationService from '../../services/config/AuthenticationService';

const FenceBracelet = () => {
  const fenceBraceletService = new FenceBraceletService();
  const fenceService = new FenceService();

  const [fenceID, setFenceID] = useState();
  const [braceletID, setBraceletID] = useState();
  const [fences, setFences] = useState([]);

  useEffect(() => {
    getFences();
  }, []);

  const onPressHandler = () => {
    registerFences();
    setText('');
    setLatitude(0.0)
    setLongitude(0.0)
    setBraceletID(0.0)
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
      radius: braceletID
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
          placeholder="ID da cerca"
          onChangeText={value => setFenceID(value)}
          value={fenceID}
          keyboardType='numeric'
        />

        <TextInput
            style={styles.input}
            placeholder="Latitude"
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


export default FenceBracelet;
