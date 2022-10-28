import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/Auth";

import styles from "./styles";

function Profile() {
  const auth = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={auth.signOut}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;
