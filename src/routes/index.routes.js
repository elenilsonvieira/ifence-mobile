import React from "react";
import OnboardingRoutes from "./onboarding.routes";
import AppRoutes from "./app.routes";
import { useAuth } from "../context/Auth";
import { NavigationContainer } from "@react-navigation/native";

export default function Routes() {
    const {authData, loading} = useAuth();

    return (
        <NavigationContainer>
        {
        loading ?
            <></> :
            authData ?
                <AppRoutes /> :
                <OnboardingRoutes />
        }
        </NavigationContainer>
    )
}