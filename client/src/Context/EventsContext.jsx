import { createContext } from "react";
import { useEvents } from "../hooks/useEvents";

export const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const eventsData = useEvents();

  return (
    <EventsContext.Provider value={eventsData}>
      {children}
    </EventsContext.Provider>
  );
}
