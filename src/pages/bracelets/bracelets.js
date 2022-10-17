import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FloatingButton from "../../components/floating-button/floationg-button";
import BraceletService from "../../services/BraceletService";

import styles from "./styles";

const Bracelets = ({ navigation }) => {
  const braceletService = new BraceletService();

  const [bracelets, setBracelets] = useState([]);

  useEffect(() => {
    getBracelets();
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
    navigation.navigate("bracelet", {
      item: item,
    });
  }

  const listBracelets = () => {
    return (
      <FlatList
        data={bracelets}
        renderItem={({ item }) => (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.item}
              key={item.id}
              onPress={() => onPressHandler(item)}
            >
              <Text style={styles.text_item}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBracelete(item)}
            >
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

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Lista de pulseiras</Text>
      </View>
      <View style={styles.body}>
        {bracelets.length > 0 ? listBracelets() : firstBracelet()}
          <FloatingButton 
            onPress={() => onPressHandler()}
          />
      </View>
    </View>
  );
};

export default Bracelets;
