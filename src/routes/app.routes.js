import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Bracelets from "../pages/bracelet/Bracelets";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {

    return (
      <Stack.Navigator screenOptions={{
          title: null,
        }}>
        <Stack.Screen 
          name='bracelets' 
          component={Bracelets}
          options={{
            title: "Lista de pulseiras"
          }}
        />
      </Stack.Navigator>
    )
}