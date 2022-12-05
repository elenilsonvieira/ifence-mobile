import React, {useEffect, useState} from 'react';
import {Alert, FlatList, ScrollView, Text, SafeAreaView, TouchableOpacity, View, Switch} from 'react-native';
import FenceService from '../../services/FenceService';
import formRegisterFence from './FenceCreateEdit';
import {fenceStyles} from './fenceStyles';
import FloatingButton from '../../components/floating-button/floating-button';
import SearchBar from '../../components/search-bar/searchBar';
import CustomMenuPopup from '../../components/custom-menu-popup/customMenuPopup';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Hearder from '../../components/header/header';

const FencesList = ({navigation}) => {
  const fenceService = new FenceService();

  const [visible, setVisible] = useState(false);
  const [element, setElement] = useState();
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
          onClosePopup();
          fenceService.delete(item.id);
          setFences(fences => {
            return fences.filter((value, index) => value !== item);
          });
        },
      },
    ]);
  };

  const search = () => {
    const params = {
      name: searchText
    }
    fenceService.search(params)
    .then(response => {
      setFences(response.data.content);
    }).catch(error => {
      console.log(error.response);
    })
  }

  const onShowPopup = (element) => {
    setElement(element);
    setVisible(true);
  };
  const onClosePopup = () => {
    setVisible(false);
  };

  const getData = () => {
    return [
      {
        id: 1,
        title: 'Ativar/Desativar',
        icon: (<Switch 
          trackColor={{false: '#FF4C30', true: '#50c878'}}
          value={element ? element.active : false}
        />),
        action: (element) => {
          fenceService.statusActive(element.id, {active: !element.active})
          .then(response => {
            setElement(response.data);
            getFences();
          }).catch(error => {
            console.log(error.response);
          })
        }
      },
      {
        id: 2,
        title: 'Editar pulseiras',
        icon: (<Icon name='watch-export' size={26} color={'#5D01EC'}></Icon>),
        action: (element) => {alert('story')}
      },
      {
        id:3,
        title: 'Editar Cerca',
        icon: (<Icon name='square-edit-outline' size={26} color={'#5D01EC'}></Icon>),
        action: (element) => {
          console.log(element);
          onClosePopup();
          onPressHandler(element);
        }
      },
      {
        id:4,
        title: 'Excluir Cerca',
        icon: (<Icon name='delete' size={26} color={'#5D01EC'}></Icon>),
        action: (element) => deleteFence(element)
      },
    ]
  }

    const onPressHandler = (element) => {
      navigation.navigate("fenceCreatEdit", {
        item: element,
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
                            onPress={() => onShowPopup(item)}
                        >
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
          <Hearder title={'Essas são suas cercas'}/>
          <View style={fenceStyles.body}>
              <SearchBar 
                placeholder='Qual cerca você quer encontrar?' 
                searchText={searchText}
                setSearchText={setSearchText}
                search={search}
              />
              {listFences()}
              <FloatingButton
                  onPress={() => onPressHandler()}
              />
          </View>
          <CustomMenuPopup 
            title="Opções da cerca"
            visible={visible}
            onTouchOutside={onClosePopup}
            data={() => getData()}
            element={element}
          />
        </View>
    );
};


export default FencesList;
