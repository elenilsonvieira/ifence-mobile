import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FloatingButton from "../../components/floating-button/floating-button";
import BraceletService from "../../services/BraceletService";

import braceletsStyles from "./braceletsStyles";

const BraceletsList = ({ navigation }) => {
  const braceletService = new BraceletService();

  const [bracelets, setBracelets] = useState([]);

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

  const listBracelets = () => {
    return (
      <FlatList
        data={bracelets}
        renderItem={({ item }) => (
          // eslint-disable-next-line react-native/no-inline-braceletsStyles
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={braceletsStyles.item}
              key={item.id}
              onPress={() => onPressHandler(item)}
            >
              <Text style={braceletsStyles.text_item}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={braceletsStyles.deleteButton}
              onPress={() => deleteBracelete(item)}
            >
              <Text style={braceletsStyles.text}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  const firstBracelet = () => {
    return (
      <View style={braceletsStyles.register}>
        <Text style={braceletsStyles.text}>Cadastre a primeira pulseira:</Text>
      </View>
    );
  };

  return (
    <View style={braceletsStyles.body}>
      <View style={braceletsStyles.header}>
        <Text style={braceletsStyles.text_header}>Lista de pulseiras</Text>
      </View>
      <View style={braceletsStyles.body}>
        {bracelets.length > 0 ? listBracelets() : firstBracelet()}
          <FloatingButton 
            onPress={() => onPressHandler()}
          />
      </View>
    </View>
  );
};

export default BraceletsList;
