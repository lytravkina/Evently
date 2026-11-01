import { createContext, useState, useEffect, useContext } from "react";
import { EventsContext } from "./EventsContext";
import { useRegistrations } from "../hooks/useRegistrations";

export const RegistrationsContext = createContext(null);

export function RegistrationsProvider({ children }) {
  const registrationsData = useRegistrations();

  return (
    <RegistrationsContext.Provider value={registrationsData}>
      {children}
    </RegistrationsContext.Provider>
  );
}
