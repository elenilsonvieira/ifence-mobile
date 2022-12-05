import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./styles";

const FloatingButton = (props) => {
  return (
      <View style={[styles.container, props.style]}>
          <TouchableOpacity onPress={props.onPress}>
            <View style={styles.button}>
                <Icon name="plus" size={48} color="#FFF"/>
            </View>
          </TouchableOpacity>
      </View>
  );
};

export default FloatingButton;
