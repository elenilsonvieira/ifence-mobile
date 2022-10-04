import React, { useEffect, useState } from "react";
import AuthenticationService from "../services/config/AuthenticationService";
import OnboardingRoutes from "./onboarding.routes";
import AppRoutes from "./app.routes";

const authenticationService = new AuthenticationService();
export default function Routes() {
    const [state, setState] = useState({
        loading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        isAuthenticated()
      }, []);

    const isAuthenticated = async () => {
        const isAuth = await authenticationService.isAuthenticated();
        setState({
            loading: false,
            isAuthenticated: isAuth,
        });
    }

    return (
        <>
        {
        state.loading ?
            <div>LOADING</div> :
            state.isAuthenticated ?
                <AppRoutes /> :
                <OnboardingRoutes />
        }
        </>
    )
}