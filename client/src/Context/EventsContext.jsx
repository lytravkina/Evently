import { createContext, useContext, useState, useEffect } from "react";
import { getEvents } from "../scripts/eventsAPI";
import { getRegistrations } from "../scripts/registrationsAPI";

export const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  let error;

  useEffect(() => {
    getEvents()
      .then((response) => setEvents(response))
      .catch((e) => (error = e.message));
    getRegistrations()
      .then((response) => setRegistrations(response))
      .catch((e) => (error = e.message));
  }, [events, registrations]);

  return (
    <EventsContext.Provider
      value={{ events, setEvents, registrations, setRegistrations, error }}
    >
      {children}
    </EventsContext.Provider>
  );
}
