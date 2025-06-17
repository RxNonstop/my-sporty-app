import React, { createContext, useState } from 'react';

export const EventoContext = createContext();

export const EventoProvider = ({ children }) => {
  const [eventos, setEventos] = useState({
    '2025-06-15': {
      marked: true,
      dotColor: 'red',
      event: 'Fútbol',
      location: 'Estadio Nacional',
      description: 'Final de campeonato de fútbol universitario',
    },
  });

  const agregarEvento = (fecha, nuevoEvento) => {
    setEventos((prev) => ({
      ...prev,
      [fecha]: {
        marked: true,
        dotColor: nuevoEvento.dotColor || 'blue',
        ...nuevoEvento,
      },
    }));
  };

  return (
    <EventoContext.Provider value={{ eventos, agregarEvento }}>
      {children}
    </EventoContext.Provider>
  );
};