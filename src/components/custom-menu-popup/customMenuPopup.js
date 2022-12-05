import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";

import customMenuStyles from "./customMenuPopupStyles";

const CustomMenuPopup = (props) => {  
  const renderOutsideTouchable = (onTouch) => {
    const view = <View style={{flex:1, width:'100%'}}/>
    if(!onTouch) return view

    return (
      <TouchableWithoutFeedback onPress={onTouch} style={{flex:1, width:'100%'}}>
        {view}
      </TouchableWithoutFeedback>
    )
  };
  
  const renderTitle = () => {
    return (
      <View style={customMenuStyles.title}>
        <Text
          style={customMenuStyles.fontTitle}
        >
          {props.title}
        </Text>
      </View>
    )
  }
  const renderContent = () => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.data()}
          renderItem={renderItem}
          extraData={props.data()}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={{paddingBottom:40}}
        />
      </View>
    )
  }

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={customMenuStyles.item} onPress={() => item.action(props.element)}>
        <Text style={customMenuStyles.textItem}>{item.title}</Text>
        {item.icon}
      </TouchableOpacity>
    )
  }
  const renderSeparator = ({item}) => {
    return (
      <View
        style={{
          opacity: 0.1,
          backgroundColor: '#182E44',
          height: 1
        }}
      />
    )
  }
  return (
    <Modal 
      transparent={true} 
      animationType={'fade'} 
      visible={props.visible}
      onRequestClose={props.onTouchOutside}
    >
      <View style={customMenuStyles.view}>
        {renderOutsideTouchable(props.onTouchOutside)}
        <View style={customMenuStyles.popup}>
          {renderTitle()}
          {renderContent()}
          
        </View>
      </View>
    </Modal>
  );
};

export default CustomMenuPopup;
