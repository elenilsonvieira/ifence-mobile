import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FloatingButton from "../../components/floating-button/floating-button";
import BraceletService from "../../services/BraceletService";

import braceletsStyles from "./braceletsStyles";
import {fenceStyles} from '../fence/fenceStyles';
import SearchBar from '../../components/search-bar/searchBar';
import CustomMenuPopup from '../../components/custom-menu-popup/customMenuPopup';

const BraceletsList = ({ navigation }) => {
  const braceletService = new BraceletService();

  const [bracelets, setBracelets] = useState([]);
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

    const onPopupEvent = (eventName, index) => {
        if (eventName !== "itemSelected") return;
        if (index === 0) console.log("PopUpMenu");
    };


    const listBracelets = () => {
        return (
            <FlatList
                data={bracelets}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                            style={braceletsStyles.item}
                            key={item.id}
                            onPress={() => onPressHandler(item)}
                        >
                            <CustomMenuPopup></CustomMenuPopup>
                            <Text style={braceletsStyles.text_item}>{item.name}</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity
              style={braceletsStyles.deleteButton}
              onPress={() => deleteBracelete(item)}
            >
              <Text style={braceletsStyles.text}>Excluir</Text>
            </TouchableOpacity>*/}
                    </View>
                )}
            />
        );
    };

  return (
    <View style={braceletsStyles.body}>
      <View style={braceletsStyles.header}>
        <Text style={braceletsStyles.text_header}>Essas são suas pulseiras</Text>
      </View>
        <View style={fenceStyles.body}>
            <SearchBar
                placeholder='Qual pulseira você quer encontrar?'
                searchText={searchText}
                setSearchText={setSearchText}
            />
            {listBracelets()}
            <FloatingButton
                onPress={() => onPressHandler()}
            />
        </View>
    </View>
  );
};

export default BraceletsList;
