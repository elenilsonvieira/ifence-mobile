import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BraceletService from "../../services/BraceletService";

import styles from "./styles";

function Bracelet(props) {
  const braceletService = new BraceletService();

  const [bracelet, setBracelet] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    if (props.route.params.item) {
      setBracelet(props.route.params.item);
      setName(props.route.params.item.name);
    }
  }, [props]);

  const onPressHandler = async () => {
    const brac = {
      id: bracelet ? bracelet.id : undefined,
      name: name,
    };

    try {
        if (bracelet) {
            await braceletService.update(brac.id, brac);
        } else {
            await braceletService.create(brac);
        }
        props.navigation.goBack();
        
    } catch (error) {
        console.log(error);
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {bracelet ? "Edição de pulseira" : "Criação de pulseira"}
      </Text>
      <View style={styles.formContent}>
        <Text style={styles.text}>Nome da pulseira</Text>
        <TextInput
          style={styles.input}
          placeholder="Pulseira da fulana"
          placeholderTextColor="#808080" 
          onChangeText={(value) => setName(value)}
          value={name}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onPressHandler}>
        <Text style={styles.text}>{bracelet ? "SALVAR" : "REGISTRAR"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Bracelet;
