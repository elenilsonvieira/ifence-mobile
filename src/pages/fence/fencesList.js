import React, {useEffect, useState} from 'react';
import {Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import FenceService from '../../services/FenceService';
import formRegisterFence from './FenceCreateEdit';
import {fenceStyles} from './fenceStyles';
import FloatingButton from '../../components/floating-button/floating-button';
import SearchBar from '../../components/search-bar/searchBar';
import CustomMenuPopup from '../../components/custom-menu-popup/customMenuPopup';

const FencesList = ({navigation}) => {
  const fenceService = new FenceService();

  const [fences, setFences] = useState([]);
  const [searchText, setSearchText] = useState([]);

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

    const onPopupEvent = (eventName, index) => {
      if (eventName !== "itemSelected") return;
      if (index === 0) console.log("PopUpMenu");
    };

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
                          <CustomMenuPopup></CustomMenuPopup>
                            <Text style={fenceStyles.text_item}>{item.name}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={fenceStyles.deleteButton}
                            onPress={() => deleteFence(item)}>
                            <Text style={fenceStyles.text}>Excluir</Text>
                        </TouchableOpacity> */}
                    </View>
                )}
                />
        );
  };

    return (
        <View style={fenceStyles.body}>
            <View style={fenceStyles.header}>
                <Text style={fenceStyles.text_header}>Essas são suas cercas</Text>
            </View>
            <View style={fenceStyles.body}>
                <SearchBar 
                  placeholder='Qual cerca você quer encontrar?' 
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
                {listFences()}
                <FloatingButton
                    onPress={() => onPressHandler()}
                />
            </View>
        </View>
    );
};


export default FencesList;
