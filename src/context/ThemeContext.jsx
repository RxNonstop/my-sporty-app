import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { toggleColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const cargarTema = async () => {
      try {
        const temaSaved = await AsyncStorage.getItem("tema");
        if (temaSaved !== null) {
          const isDark = temaSaved === "dark";
          setIsDarkMode(isDark);
          if (isDark) {
            toggleColorScheme();
          }
        }
      } catch (err) {
        console.error("Error al cargar tema:", err);
      }
      setCargando(false);
    };
    cargarTema();
  }, []);

  const toggleTema = async () => {
    try {
      const nuevoTema = !isDarkMode;
      setIsDarkMode(nuevoTema);
      await AsyncStorage.setItem("tema", nuevoTema ? "dark" : "light");
      toggleColorScheme();
    } catch (err) {
      console.error("Error al guardar tema:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTema, cargando }}>
      {children}
    </ThemeContext.Provider>
  );
};
