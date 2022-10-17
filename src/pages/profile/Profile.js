import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthenticationService from "../../services/config/AuthenticationService";

import styles from "./styles";

function Profile(props) {
  const logout = () => {
    const auth = new AuthenticationService();
    auth.logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;
