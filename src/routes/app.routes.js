import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Locations from "../pages/locations/locations";
import FencesList from "../pages/fence/fencesList";
import BraceletsList from "../pages/bracelets/braceletsList";
import AlarmsList from "../pages/alarms/alarmsList";
import AlarmInfo from "../pages/alarms/alarmInfo";
import BraceletEdit from "../pages/bracelets/braceletEdit";
import Profile from "../pages/profile/Profile";
import FenceCreateEdit from "../pages/fence/FenceCreateEdit";
import BraceletSimulator from "../pages/tests/BraceletSimulator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlarmStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="alarms"
          component={AlarmsList}
          options={{
            title: "Histórico de Alarme",
          }}
        />
        <Stack.Screen
          name="alarm"
          component={AlarmInfo}
          options={{
            title: "Alarme",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ProfileStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{
            title: "Perfil",
          }}
        />

        <Stack.Screen
          name="simulateBracelet"
          component={BraceletSimulator}
          screenOptions={{
            title: "Simulador de pulseira",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function BraceletStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="braceletsList"
          component={BraceletsList}
          options={{
            title: "Lista de pulseira",
          }}
        />
        <Stack.Screen
          name="braceletEdit"
          component={BraceletEdit}
          options={{
            title: "Pulseira",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function FenceStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2405F2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat',
            fontSize: 22,
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="fencesList"
          component={FencesList}
          options={{
            title: "Cercas",
          }}
        />
        <Stack.Screen
          name="fenceCreatEdit"
          component={FenceCreateEdit}
          options={{
            title: "Criação/Edição de cerca",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppRoutes() {
  function getTabBarVisibility(route) {
    const focusedRoute = getFocusedRouteNameFromRoute(route) ?? "braceletsList";
    return focusedRoute === "braceletsList";
  }

  function renderIcon(name, focused) {
    return <Icon name={name} size={32} color={focused?"#9305F2":"#5D01EC"} />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 14,
          bottom: 8,
        },
        tabBarActiveBackgroundColor: '#DCDCDC',
        tabBarInactiveBackgroundColor: '#DCDCDC',
        tabBarStyle: {
          backgroundColor: '#ffff' 
        }
      }}
      >
      <Tab.Screen
        name="fences"
        component={FenceStack}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => renderIcon("fence", focused),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="bracelets"
        component={BraceletStack}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => renderIcon("watch", focused),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="location"
        component={Locations}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => renderIcon("history", focused),
          tabBarStyle: {
            display: getTabBarVisibility(route) ? "flex" : "none",
          },
          title: "Localização das pulseiras",
        })}
      />
      <Tab.Screen
        name="Alarms"
        component={AlarmStack}
        options={{
          tabBarIcon: ({ focused }) => renderIcon("bell", focused),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="config"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => renderIcon("account", focused),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
