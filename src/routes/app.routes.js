import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Locations from "../pages/locations/locations";
import FencesList from '../pages/fence/fencesList';
import BraceletsList from "../pages/bracelets/braceletsList";
import Alarms from "../pages/alarms/alarms";
import Alarm from "../pages/alarm/alarm";
import BraceletEdit from "../pages/bracelets/braceletEdit";
import Profile from "../pages/profile/Profile";
import FenceCreateEdit from '../pages/fence/FenceCreateEdit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlarmStack() {
  return (
    <NavigationContainer independent={true}>
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
    </NavigationContainer>
  )
}

function BraceletStack() {
  return (
    <NavigationContainer independent={true} >
      <Stack.Navigator>
        <Stack.Screen
          name="braceletsList"
          component={BraceletsList}
          options={{
            title: "Lista de pulseira"
          }}
        />
        <Stack.Screen
          name="braceletEdit"
          component={BraceletEdit}
          options={{
            title: "Pulseira"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function FenceStack() {
  return (
    <NavigationContainer independent={true} >
      <Stack.Navigator>
          <Stack.Screen
              name="fencesList"
              component={FencesList}
              options={{
                  title: "Lista de cercas"
              }}
          />
          <Stack.Screen
              name="fenceCreatEdit"
              component={FenceCreateEdit}
              options={{
                  title: "Criação/Edição de cerca"
              }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default function AppRoutes() {
  function getTabBarVisibility(route) {
    const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'braceletsList'
    return focusedRoute === 'braceletsList'
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
            component={FenceStack}
            options={({route}) => ({
                tabBarIcon: ({color}) => renderIcon('fence', color),
                tabBarStyle: {display: getTabBarVisibility(route) ? 'flex' : 'none'},
                headerShown: false,
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
