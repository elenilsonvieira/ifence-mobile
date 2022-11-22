import React from "react";
import {
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import customMenuStyles from "./customMenuPopupStyles";

const CustomMenuPopup = (props) => {
  return (
    <View style={customMenuStyles.menu}>
      <TouchableOpacity onPress={() => {}}>
        <Icon
          name="dots-vertical"
          size={24}
          color={"#FAFBFD"}
          />
      </TouchableOpacity>
  </View>
  );
};

export default CustomMenuPopup;
