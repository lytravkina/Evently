import { createContext, useState, useContext } from "react";
import { EventsContext } from "./EventsContext";
import { RegistrationsContext } from "./RegistrationsContext";

export const PageContext = createContext();

export function PageProvider({ children }) {
  const { events } = useContext(EventsContext);
  const { registrations } = useContext(RegistrationsContext);

  const [activeTab, setActiveTab] = useState("events");

  const registeredEvents = events.filter((event) => {
    return registrations.some(
      (registration) => registration.eventId === event.id,
    );
  });

  const currentEvents = activeTab === "events" ? events : registeredEvents;

  return (
    <PageContext.Provider value={{ activeTab, setActiveTab, currentEvents }}>
      {children}
    </PageContext.Provider>
  );
}
