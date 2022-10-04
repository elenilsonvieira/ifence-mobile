import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const [text, setText] = useState('');

  const [bracelets, setBracelets] = useState([]);

  const onPressHandler = () => {
    const bracelet = {
      id: Date.now(),
      name: text,
    };
    setText('');
    setBracelets([...bracelets, bracelet]);
  };

  const deleteBracelete = item => {
    Alert.alert('Cuidado', `Gostaria de excluir a pulseira de ${item.name}?`, [
      {text: 'Cancelar'},
      {
        text: 'Excluir',
        onPress: () => {
          // eslint-disable-next-line no-shadow
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

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Lista de pulseiras</Text>
      </View>
      <View style={styles.body}>
        {bracelets.length > 0 ? listBracelets() : firstBracelet()}
        {registerBracelet()}
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

export default App;
