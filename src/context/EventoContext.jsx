import React, { createContext, useState, useCallback, useMemo } from "react";

export const EventoContext = createContext();

export const EventoProvider = ({ children }) => {
  const [eventos, setEventos] = useState({
    "2025-06-15": {
      marked: true,
      dotColor: "red",
      event: "Fútbol",
      location: "Estadio Nacional",
      description: "Final de campeonato de fútbol universitario",
    },
  });

  const agregarEvento = useCallback((fecha, nuevoEvento) => {
    setEventos((prev) => ({
      ...prev,
      [fecha]: {
        marked: true,
        dotColor: nuevoEvento.dotColor || "blue",
        ...nuevoEvento,
      },
    }));
  }, []);

  const value = useMemo(() => ({
    eventos,
    agregarEvento
  }), [eventos, agregarEvento]);

  return (
    <EventoContext.Provider value={value}>
      {children}
    </EventoContext.Provider>
  );
};
