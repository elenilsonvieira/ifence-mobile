import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Locations from "../pages/locations/locations";
import Fences from '../pages/fence/fences';
import FenceBracelet from '../pages/fenceBracelet/fenceBracelet';
import Bracelets from "../pages/bracelets/bracelets";
import Alarms from "../pages/alarms/alarms";
import Alarm from "../pages/alarm/alarm";
import BraceletEdit from "../pages/braceletEdit/braceletEdit";
import Profile from "../pages/profile/Profile";

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

function BraceletStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='bracelets'
        component={Bracelets}
        options={{
          title: "Lista de pulseira"
        }}
      />
      <Stack.Screen
        name="bracelet"
        component={BraceletEdit}
        options={{
          title: "Pulseira"
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
        screenOptions={
            {
                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    fontSize: 14,
                    bottom: 8,
                },
                tabBarStyle: [
                    {
                        display: 'flex'
                    },
                    null
                ]
            }
        }
        /*tabBarOptions={{
              labelStyle: {
                  fontSize: 14,
                  bottom: 8
              },
              style: {
                  height: 70
              },
              showLabel: false,
          }}*/
      >
          <Tab.Screen
              name="bracelets"
              component={BraceletStack}

              options={({route}) => ({
                      tabBarIcon: ({color}) =>
                        renderIcon('home', color),
                      tabBarStyle: { display: getTabBarVisibility(route) ? 'flex' : 'none'},
                      headerShown: false,
                  })
              }
          />
        <Tab.Screen
            name="fences"
            component={Fences}
            options={({route}) => ({
                tabBarIcon: ({color}) => renderIcon('fence', 'red'),
                tabBarStyle: {display: getTabBarVisibility(route) ? 'flex' : 'none'},
                title: "Cercas"
            })}
        />
        <Tab.Screen
            name="fenceBracelet"
            component={FenceBracelet}
            options={({route}) => ({
                tabBarIcon: ({color}) => renderIcon('fence', 'red'),
                tabBarStyle: {display: getTabBarVisibility(route) ? 'flex' : 'none'},
                title: "Cerca e pulseira"
            })}
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
          <Tab.Screen
              name="profile"
              component={Profile}
              options={{
                  tabBarIcon: ({color}) =>
                    renderIcon('account', color),
                    headerShown: false,
              }}
          />
      </Tab.Navigator>
  )
}
