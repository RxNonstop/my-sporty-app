import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [cargando, setCargando] = useState(true);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const cargarTema = async () => {
      try {
        const temaSaved = await AsyncStorage.getItem("tema");
        if (temaSaved !== null) {
          const isDark = temaSaved === "dark";
          setIsDarkMode(isDark);
          setColorScheme(temaSaved);
        } else {
          // Si no hay tema guardado, usar el de NativeWind (sistema por defecto)
          setIsDarkMode(colorScheme === "dark");
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
      const temaString = nuevoTema ? "dark" : "light";
      setIsDarkMode(nuevoTema);
      await AsyncStorage.setItem("tema", temaString);
      setColorScheme(temaString);
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
