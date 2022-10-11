import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Bracelets from "../pages/bracelet/bracelets";
import Alarms from "../pages/alarms/alarms";
import Alarm from "../pages/alarm/alarm";
import Locations from "../pages/locations/locations";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlarmStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='alarms'
        component={Alarms}
        options={{
          title: "Histórico de Alarme"
        }}
      />
      <Stack.Screen
        name="alarm"
        component={Alarm}
        options={{
          title: "Alarme"
        }}
      />
  </Stack.Navigator>
  )
}

export default function AppRoutes() {
  function getTabBarVisibility(route) {
    const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'bracelets'
    return focusedRoute === 'bracelets'
  }

  function renderIcon(name, color) {
    return (
        <Icon
            name={name}
            size={36}
            color={color}
        />
    )
  }

  return (
    <Tab.Navigator
          tabBarOptions={{
              labelStyle: {
                  fontSize: 14,
                  bottom: 8
              },
              style: {
                  height: 70
              },
              showLabel: false,
          }}
      >
          <Tab.Screen
              name="bracelets"
              component={Bracelets}

              options={({route}) => ({
                      tabBarIcon: ({color}) =>
                        renderIcon('home', color),
                      tabBarStyle: { display: getTabBarVisibility(route) ? 'flex' : 'none'},
                      title: "Lista de pulseiras"
                  })
              }
          />
          <Tab.Screen
              name="location"
              component={Locations}
              options={({route}) => ({
                      tabBarIcon: ({color}) =>
                        renderIcon('history', color),
                      tabBarStyle: { display: getTabBarVisibility(route) ? 'flex' : 'none'},
                      title: "Localização das pulseiras"
                  })
              }
          />
          <Tab.Screen
              name="Alarms"
              component={AlarmStack}
              options={{
                  tabBarIcon: ({color}) =>
                    renderIcon('bell', color),
                    headerShown: false,
              }}
          />
      </Tab.Navigator>
  )
}
