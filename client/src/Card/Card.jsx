import { useState } from "react";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";
import style from "./card.module.css";
import EditForm from "../Forms/EditForm";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";
import { deleteEvent as deleteEventRequest } from "../api/eventsAPI";
import { updateEvent } from "../api/eventsAPI";
import { deleteRegistration as deleteRegistrationRequest } from "../api/registrationsAPI";
import { useModal } from "../store/pageStore";

export function Card({ id, isEdit, anyEdit, ...props }) {
  return (
    <article
      className={`${style.card} ${anyEdit && !isEdit ? style.disabled : ""}`}
      id={id}
    >
      <div className={style.cardWrapper}>
        {isEdit ? (
          <EditForm id={id} props={props} />
        ) : (
          <CardContent id={id} props={props} />
        )}
      </div>
    </article>
  );
}

function CardContent({ id, props }) {
  const {
    tab,
    title,
    category,
    description,
    date,
    location,
    capacity,
    onEdit,
    ...rest
  } = props;

  const openRegistrationModal = useModal(
    (state) => state.openRegistrationModal,
  );
  const { events, loadEvents } = useEvents();
  const { registrations, loadRegistrations } = useRegistrations();

  const [isEventsLoading, setEventsLoading] = useState(true);
  const [isRegistrationsLoading, setRegistrationsLoading] = useState(true);

  const [eventsError, setEventsError] = useState(null);
  const [registrationsError, setRegistrationsError] = useState(null);

  const isPast = new Date(date).getTime() < Date.now();

  async function deleteEvent(id) {
    const confirmed = confirm("Вы действительно хотите удалить мероприятие?");
    if (confirmed) {
      setEventsLoading(true);
      try {
        await deleteEventRequest(id);
        await loadEvents();
      } catch (e) {
        setEventsError(e.message);
      } finally {
        setEventsLoading(false);
      }
    }
  }

  async function deleteRegistration(eventId) {
    const registrationId = registrations.find(
      (registration) => registration.eventId === eventId,
    ).id;

    const registeredEvent = events.find((event) => event.id === eventId);

    const confirmed = confirm(
      "Вы действительно хотите отменить запись на мероприятие?",
    );
    if (confirmed) {
      setRegistrationsLoading(true);
      try {
        await deleteRegistrationRequest(registrationId);
        await updateEvent({
          ...registeredEvent,
          capacity: registeredEvent.capacity + 1,
        });
        await Promise.all([loadRegistrations(), loadEvents()]);
      } catch (e) {
        setRegistrationsError(e.message);
      } finally {
        setRegistrationsLoading(false);
      }
    }
  }

  return (
    <>
      <div className={`${shared.flexColumn} ${style.cardTop}`}>
        <div
          className={`${shared.subtitle} ${shared.subtitleBackground} ${style.cardSubtitle}`}
        >
          {category}
        </div>
        <h2 className={`${shared.title} ${style.cardTitle}`}>{title}</h2>
        <p className={shared.description}>{description}</p>
        {tab === "events" && (
          <>
            <button
              className={`${style.iconButton} ${style.iconButtonLeft}`}
              onClick={() => onEdit(id)}
            >
              <img src="./src/assets/icons/edit-button.svg" />
            </button>
            <button
              className={style.iconButton}
              onClick={() => deleteEvent(id)}
            >
              <img src="./src/assets/icons/delete-button.svg" />
            </button>
          </>
        )}
      </div>
      <div className={`${shared.flexColumn} ${style.cardBottom}`}>
        <div className={style.cardInfo}>
          <div>
            <img src="./src/assets/icons/icon-date.svg" />
          </div>
          <span className={isPast ? style.dateInvalid : ""}>
            {formatDate(date)}
          </span>
        </div>
        <div className={style.cardInfo}>
          <div>
            <img src="./src/assets/icons/icon-location.svg" />
          </div>
          <span>{location}</span>
        </div>
        <div className={style.cardInfo}>
          <span>
            <span>{capacity}</span> мест
          </span>
        </div>

        {tab === "events" ? (
          <Button onClick={() => openRegistrationModal(id)}>Записаться</Button>
        ) : (
          <Button
            className={shared.buttonTransparent}
            onClick={() => deleteRegistration(id)}
          >
            Отменить запись
          </Button>
        )}
      </div>
    </>
  );
}

function formatDate(string) {
  let [date, time] = string.split("T");

  const [year, month, day] = date.split("-");

  const [hour, minute] = time.split(":");

  const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

  return formattedDate;
}
