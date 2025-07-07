import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // useEffect(() => {
  //   const cargarUsuario = async () => {
  //     setCargando(true);
  //     const userData = await AsyncStorage.getItem('user');
  //     if (userData) {
  //       setUsuario(JSON.parse(userData));
  //     }
  //     setCargando(false);
  //   };
  //   cargarUsuario();
  // }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    console.log(user,"usuario")
    if (user){
      setUsuario(user.usuario);
      setIsAuthenticated(true)
    }
  };

  const register = async (data) => {
    await authService.register(data);
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, login, logout, register, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};