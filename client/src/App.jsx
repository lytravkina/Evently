import { useEffect, useState, useRef } from "react";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import EventsSection from "./EventsSection/EventsSection";
import Modal from "./Modal/Modal";
import { getEvents } from "./scripts/eventsAPI";
import { getRegistrations } from "./scripts/registrationsAPI";

function App() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [themeIsDark, setTheme] = useState(false);

  const cardId = useRef(null);

  let error;

  const registeredEvents = events.filter((event) => {
    return registrations.some(
      (registration) => registration.eventId === event.id,
    );
  });

  const currentEvents = activeTab === "events" ? events : registeredEvents;

  function handleModalOpen(id = null) {
    setModalOpen(true);
    cardId.current = id;
  }

  function handleModalClose(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    setModalOpen(false);
    cardId.current = null;
  }

  useEffect(() => {
    getEvents()
      .then((response) => setEvents(response))
      .catch((e) => (error = e.message));
    getRegistrations()
      .then((response) => setRegistrations(response))
      .catch((e) => (error = e.message));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeIsDark ? "dark" : "light";
  }, [themeIsDark]);

  return (
    <>
      <Header
        onTabChange={setActiveTab}
        onThemeChange={setTheme}
        theme={themeIsDark}
      />

      <main className="events-page">
        <Hero tab={activeTab} />
        <EventsSection
          tab={activeTab}
          events={currentEvents}
          error={error}
          onButtonClick={handleModalOpen}
        />
      </main>

      {modalOpen && (
        <Modal
          onClose={handleModalClose}
          cardId={cardId.current}
          events={currentEvents}
          registrations={registrations}
        />
      )}
    </>
  );
}

export default App;
