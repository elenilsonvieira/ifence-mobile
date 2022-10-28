import React, { createContext, useContext, useEffect, useState } from "react";
import AuthenticationService from "../services/config/AuthenticationService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const authenticationService = new AuthenticationService();

  const [authData, setAuthData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    const isAuth = await authenticationService.isAuthenticated();
    setAuthData(isAuth);
    setLoading(false);
  };

  const signIn = async (email, password) => {
    const _authData = await authenticationService.login(email, password);
    setAuthData(_authData);
  };

  const signOut = async () => {
    await authenticationService.logout();
    setAuthData(undefined);
  };

  return (
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth is not being used in AuthProvider");
  }

  return context;
}
