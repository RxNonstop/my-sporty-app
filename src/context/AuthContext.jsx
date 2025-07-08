import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const user = await authService.getUser();
          setUsuario(user);
        }
      } catch (err) {
        console.error('No se pudo obtener usuario', err);
        await AsyncStorage.clear();
      }
      setCargando(false);
    };
    cargarUsuario();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    console.log(data,"usuario")
    if (data){
      setUsuario(data);
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
    <AuthContext.Provider value={{ usuario, login, logout, register, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};