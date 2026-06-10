import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/AuthService";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const user = await authService.getUser();
        setUsuario(user);
      }
    } catch (err) {
      console.error("No se pudo obtener usuario", err);
      await AsyncStorage.clear();
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  useEffect(() => {
    if (usuario) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          authService.updatePushTokenService(token);
        }
      });
    }
  }, [usuario]);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    if (data) {
      setUsuario(data);
    }
  }, []);

  const register = useCallback(async (data) => {
    const user = await authService.register(data);
    if (user) {
      setUsuario(user);
    }
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUsuario(null);
  }, []);

  const updateUsuario = useCallback(async (data) => {
    if (!usuario?.id) return;
    const updatedUser = await authService.updateUser(usuario.id, data);
    if (updatedUser) {
      setUsuario(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }
  }, [usuario]);

  const value = useMemo(() => ({
    usuario,
    login,
    logout,
    register,
    updateUsuario,
    cargando
  }), [usuario, login, logout, register, updateUsuario, cargando]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
