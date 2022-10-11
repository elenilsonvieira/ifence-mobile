import React from "react";

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Icon from 'react-native-m'
import Bracelets from "../pages/bracelet/bracelets";
import Fences from '../pages/fence/fences';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {

    return (
      <Stack.Navigator screenOptions={{
          title: null,
        }}>
{/*
        <Stack.Screen
          name='bracelets'
          component={Bracelets}
          options={{
            title: "Lista de pulseiras"
          }}
        />
*/}
          <Stack.Screen
              name='fences'
              component={Fences}
              options={{
                  title: "Lista de cercas"
              }}
          />
      </Stack.Navigator>
    )
}
