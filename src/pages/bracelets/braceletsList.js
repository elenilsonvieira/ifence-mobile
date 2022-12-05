import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomMenuPopup from "../../components/custom-menu-popup/customMenuPopup";
import FloatingButton from "../../components/floating-button/floating-button";
import Hearder from "../../components/header/header";
import SearchBar from "../../components/search-bar/searchBar";
import BraceletService from "../../services/BraceletService";

import braceletsStyles from "./braceletsStyles";

const BraceletsList = ({ navigation }) => {
  const braceletService = new BraceletService();

  const [bracelets, setBracelets] = useState([]);
  const [visible, setVisible] = useState(false);
  const [element, setElement] = useState();
  const [searchText, setSearchText] = useState([]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getBracelets();
    });
  }, []);

  const getBracelets = () => {
    braceletService
      .findAll()
      .then((response) => {
        setBracelets(response.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteBracelete = (item) => {
    Alert.alert("Cuidado", `Gostaria de excluir a pulseira de ${item.name}?`, [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: () => {
          // eslint-disable-next-line no-shadow
          braceletService.delete(item.id);
          setBracelets((bracelets) => {
            return bracelets.filter((value, index) => value !== item);
          });
        },
      },
    ]);
  };

  function onPressHandler(item) {
    navigation.navigate("braceletEdit", {
      item: item,
    });
  }

  const firstBracelet = () => {
    return (
      <View style={braceletsStyles.register}>
        <Text style={braceletsStyles.text}>Cadastre a primeira pulseira:</Text>
      </View>
    );
  };

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
        title: 'Editar Pulseira',
        icon: (<Icon name='watch-export' size={26} color={'#5D01EC'}></Icon>),
        action: (element) => {
          onClosePopup();
          onPressHandler(element);
        }
      },
      {
        id:2,
        title: 'Excluir Pulseira',
        icon: (<Icon name='delete' size={26} color={'#5D01EC'}></Icon>),
        action: (element) => {
          onClosePopup();
          deleteBracelete(element);
        }
      },
    ]
  }

  const search = () => {
    const params = {
      name: searchText
    }
    braceletService.search(params)
    .then(response => {
      setBracelets(response.data.content);
    }).catch(error => {
      console.log(error.response);
    })
  }

  const renderContent = () => {
    return (
        <FlatList
          style={{marginBottom: 20}}
          numColumns={2}
          data={bracelets}
          renderItem={renderItem}
          extraData={bracelets}
          keyExtractor={(item, index) => index.toString()}
        />
    )
  }
  const renderItem = ({item, index}) => {
    return (
      <View style={braceletsStyles.itemContent}>
          <TouchableOpacity
              style={[braceletsStyles.item, index%2==0 ? {marginLeft: 20, marginRight: 7} : {marginLeft: 7, marginRight:20}]}
              key={item.id}
              onPress={() => onShowPopup(item)}
          >
            <Text style={braceletsStyles.text_item}>{item.name}</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={braceletsStyles.body}>
      <Hearder title={'Essas são suas pulseiras'}/>
      <View style={braceletsStyles.body}>
        <SearchBar 
          placeholder='Qual cerca você quer encontrar?' 
          searchText={searchText}
          setSearchText={setSearchText}
          search={search}
        />
        {bracelets.length > 0 ? renderContent() : firstBracelet()}
          <FloatingButton 
            onPress={() => onPressHandler()}
          />
      </View>
      <CustomMenuPopup 
        title="Opções da pulseira"
        visible={visible}
        onTouchOutside={onClosePopup}
        data={() => getData()}
        element={element}
      />
    </View>
  );
};

export default BraceletsList;
