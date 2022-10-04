import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../pages/login/login";

const Stack = createNativeStackNavigator();

export default function OnboardingRoutes(params) {
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
              name='login' 
              component={Login}
              screenOptions={{
                title: "Login",
              }}
            />
          </Stack.Navigator>
    )
}