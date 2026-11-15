import { useContext, useState } from "react";
import style from "./card-list.module.css";
import shared from "../styles/shared.module.css";
import { Card } from "../Card/Card";
import { PageContext } from "../Context/PageContext";
import { EventsContext } from "../Context/EventsContext";
import { RegistrationsContext } from "../Context/RegistrationsContext";
import Spinner from "../Spinner/Spinner";
import Sorting from "../Sorting/Sorting";

function CardList({ events, onButtonClick, checked, onCheck }) {
  const { activeTab } = useContext(PageContext);
  const { eventsError, isEventsLoading, handleDeleteAllEvents } =
    useContext(EventsContext);
  const {
    registrationsError,
    isRegistrationsLoading,
    handleDeleteAllRegistrations,
  } = useContext(RegistrationsContext);

  const [editId, setEditId] = useState(null);

  const isLoading = isEventsLoading || isRegistrationsLoading;

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
          <button
            className={style.buttonDeleteAll}
            onClick={
              activeTab === "events"
                ? handleDeleteAllEvents
                : handleDeleteAllRegistrations
            }
          >
            Очистить все
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
            >
              <path
                d="M15.4245 7.59003C15.4245 15.6091 16.5788 19.2338 8.81495 19.2338C1.05018 19.2338 2.22828 15.6091 2.22828 7.59003"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.9005 4.51574H0.75"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.2502 4.51571C12.2502 4.51571 12.7788 0.75 8.82451 0.75C4.87118 0.75 5.39975 4.51571 5.39975 4.51571"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
