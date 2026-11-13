import { useContext, useEffect, useRef, useState } from "react";
import CardList from "../CardList/CardList";
import shared from "../styles/shared.module.css";
import { PageContext } from "../Context/PageContext";
import { useFilters } from "../hooks/useFilters";
import { usePage } from "../store/pageStore";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";

function EventsSection({ onButtonClick }) {
  // const { currentEvents } = useContext(PageContext);

  const activeTab = usePage((state) => state.activeTab);
  const events = useEvents((state) => state.events);
  const registrations = useRegistrations((state) => state.registrations);

  const registeredEvents = events.filter((event) => {
    return registrations.some(
      (registration) => registration.eventId === event.id,
    );
  });

  const currentEvents = activeTab === "events" ? events : registeredEvents;

  const {
    search,
    category,
    sortingType,
    setSearch,
    setCategory,
    setSortingType,
    categories,
    sortedEvents,
  } = useFilters(currentEvents);

  return (
    <section className={shared.flexColumn}>
      <div className={shared.flexRow}>
        <input
          type="text"
          placeholder="Поиск по названию и описанию..."
          value={search}
          className={shared.input}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={shared.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <CardList
        events={sortedEvents(sortingType)}
        activeTab={activeTab}
        onButtonClick={onButtonClick}
        checked={sortingType}
        onCheck={setSortingType}
      />
    </section>
  );
}

export default EventsSection;
