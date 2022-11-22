import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native";

import searchBarStyles from "./searchBarStyles";

const SearchBar = (props) => {
  return (
      <View style={[searchBarStyles.container, props.style]}>
        <TextInput
          placeholder={props.placeholder}
          style={searchBarStyles.input}
          value={props.searctText}
          onChangeText={(text) => props.setSearchText(text)}
        />
        <Icon style={searchBarStyles.searchIcon} name='search' size={18} color='#6D6D6D'/>
      </View>
  );
};

export default SearchBar;
