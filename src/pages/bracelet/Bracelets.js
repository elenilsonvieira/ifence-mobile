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
import BraceletService from '../../services/BraceletService';
import AuthenticationService from '../../services/config/AuthenticationService';

const Bracelets = () => {
  const braceletService = new BraceletService();

  const [text, setText] = useState('');
  const [bracelets, setBracelets] = useState([]);

  useEffect(() => {
    getBracelets();
  }, []);

  const onPressHandler = () => {
    const bracelet = {
      id: Date.now(),
      name: text,
    };

    registerBracelets();
    setText('');
    setBracelets([...bracelets, bracelet]);
  };

  const getBracelets = () => {
    braceletService.findAll()
      .then(response => {
        setBracelets(response.data.content);
      }).catch( error => {
        console.log(error);
      });
  };
  const registerBracelets = async () => {
    const brac = {
      "name": text
    }
    braceletService.create(brac)
      .then( response => 
        {
            console.log("Response " + response.data.content);
        }
    ).catch( error => {
      console.log(error.response);
    });
  }

  const deleteBracelete = item => {
    Alert.alert('Cuidado', `Gostaria de excluir a pulseira de ${item.name}?`, [
      {text: 'Cancelar'},
      {
        text: 'Excluir',
        onPress: () => {
          // eslint-disable-next-line no-shadow
          braceletService.delete(item.id);
          setBracelets(bracelets => {
            return bracelets.filter((value, index) => value !== item);
          });
        },
      },
    ]);
  };

  const listBracelets = () => {
    return (
      <FlatList
        data={bracelets}
        renderItem={({item}) => (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.item} key={item.id}>
              <Text style={styles.text_item}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBracelete(item)}>
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
        <Text style={styles.text}>Cadastre a primeira pulseira:</Text>
      </View>
    );
  };

  const registerBracelet = () => {
    return (
      <View style={styles.register}>
        <TextInput
          style={styles.input}
          placeholder="Pulseira da fulana"
          onChangeText={value => setText(value)}
          value={text}
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
        <Text style={styles.text_header}>Lista de pulseiras</Text>
      </View>
      <View style={styles.body}>
        {bracelets.length > 0 ? listBracelets() : firstBracelet()}
        {registerBracelet()}
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


export default Bracelets;