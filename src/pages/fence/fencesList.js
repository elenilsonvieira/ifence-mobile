import React, {useEffect, useState} from 'react';
import {Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import formRegisterFence from './FenceCreateEdit';
import {fenceStyles} from './fenceStyles';
import FloatingButton from '../../components/floating-button/floating-button';

const FencesList = ({navigation}) => {
  const fenceService = new FenceService();

  const [fences, setFences] = useState([]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getFences();
    });
  }, []);

  const getFences = () => {
    fenceService.findAll()
      .then(response => {
        setFences(response.data.content);
      }).catch( error => {
        console.log(error);
      });
  };

  const deleteFence = item => {
    Alert.alert('Cuidado', `Gostaria de excluir a cerca ${item.name}?`, [
      {text: 'Cancelar'},
      {
        text: 'Excluir',
        onPress: () => {
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={fenceStyles.item}
                            key={item.id}
                            onPress={() => onPressHandler(item)}
                        >
                            <Text style={fenceStyles.text_item}>{item.name}</Text>
                        </TouchableOpacity>
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
