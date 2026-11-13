import { useContext, useEffect, useState } from "react";
import style from "./card-list.module.css";
import shared from "../styles/shared.module.css";
import { Card } from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import Sorting from "../Sorting/Sorting";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";
import { DeleteAllButton } from "../DeleteAllButton/DeleteAllButton";

function CardList({ events, activeTab, onButtonClick, checked, onCheck }) {
  const loadEvents = useEvents((state) => state.loadEvents);
  const loadRegistrations = useRegistrations(
    (state) => state.loadRegistrations,
  );

  const [isEventsLoading, setEventsLoading] = useState(true);
  const [isRegistrationsLoading, setRegistrationsLoading] = useState(true);

  const [eventsError, setEventsError] = useState(null);
  const [registrationsError, setRegistrationsError] = useState(null);

  const [editId, setEditId] = useState(null);

  const isLoading = isEventsLoading || isRegistrationsLoading;

  useEffect(() => {
    (async () => {
      setEventsLoading(true);
      try {
        await loadEvents();
      } catch (e) {
        setEventsError(e.message);
      } finally {
        setEventsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setRegistrationsLoading(true);
      try {
        await loadRegistrations();
      } catch (e) {
        setRegistrationsError(e.message);
      } finally {
        setRegistrationsLoading(false);
      }
    })();
  }, []);

  return (
    <div className={style.cardsWrapper}>
      {activeTab === "events" && (
        <button
          className={style.buttonAdd}
          onClick={() => onButtonClick({ type: "open-event-modal" })}
        >
          Создать событие
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
          >
            <path
              d="M9.83521 16.0078H16.2122"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.5578 1.35883V1.35883C11.2138 0.350828 9.30779 0.622828 8.29979 1.96583C8.29979 1.96583 3.28679 8.64383 1.54779 10.9608C-0.191209 13.2788 1.45379 16.1508 1.45379 16.1508C1.45379 16.1508 4.69779 16.8968 6.41179 14.6118C8.12679 12.3278 13.1638 5.61683 13.1638 5.61683C14.1718 4.27383 13.9008 2.36683 12.5578 1.35883Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.00415 3.7113L11.8682 7.3623"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {events.length > 0 && (
        <div className={style.buttonWrapper}>
          <Sorting checked={checked} onCheck={onCheck} />
          <DeleteAllButton className={style.buttonDeleteAll} />
        </div>
      )}

      {isLoading && <Spinner />}

      {events.length === 0 && !isLoading ? (
        <p className={`${shared.subtitle} ${shared.subtitleBackground}`}>
          {eventsError || registrationsError || "Нет доступных мероприятий"}
        </p>
      ) : (
        events.map((event) => (
          <Card
            tab={activeTab}
            id={event.id}
            key={event.id}
            category={event.category}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
            capacity={event.capacity}
            onButtonClick={onButtonClick}
            isEdit={editId === event.id}
            anyEdit={!!editId}
            onEdit={setEditId}
            onQuit={() => setEditId(null)}
            events={events}
          />
        ))
      )}
    </div>
  );
}

export default CardList;
