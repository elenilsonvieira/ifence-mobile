import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/Auth";

import styles from "./styles";

function Profile({navigation}) {
  const auth = useAuth();

  const simulateBracelet = () => {
    navigation.navigate('simulateBracelet');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={auth.signOut}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={simulateBracelet}>
        <Text style={styles.text}>Simular Pulseira</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;
