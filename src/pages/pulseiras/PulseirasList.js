import React from 'react';
import {Button, Text, View} from 'react-native';

function NoteList({navigation}) {
  function navigateToNextPage() {
    navigation.navigate('noteView');
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>Tela NoteList</Text>

      <Button title="NAVEGAR" onPress={navigateToNextPage} />
    </View>
  );
}
