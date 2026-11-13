import { useContext } from "react";
import EventForm from "../Forms/EventForm";
import RegistrationForm from "../Forms/RegistrationForm";
import shared from "../styles/shared.module.css";
import style from "./modal.module.css";
import { EventsContext } from "../Context/EventsContext";

function Modal({ cardId, onClose }) {
  const { events } = useContext(EventsContext);

  function handleClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    onClose();
  }

  return (
    <div className={style.modal} onClick={(e) => handleClick(e)}>
      <div className={style.dialog}>
        <div className={shared.flexColumn}>
          <div className={shared.subtitle}>
            {cardId ? "Запись" : "Добавление"}
          </div>
          <h2 className={`${shared.title} ${style.modalTitle}`}>
            {cardId
              ? events.find((event) => event.id === cardId).title
              : "Расскажите о событии"}
          </h2>
          <p className={shared.description}>
            {cardId
              ? "Оставь контакты, чтобы подтвердить участие"
              : "Заполните данные о мероприятии, чтобы о нем узнало больше людей"}
          </p>
          <button className={style.closeButton} onClick={(e) => handleClick(e)}>
            ×
          </button>
        </div>
        {cardId ? (
          <RegistrationForm
            // events={events}
            eventId={cardId}
            onRegistrationPost={onClose}
          />
        ) : (
          <EventForm events={events} onEventPost={onClose} />
        )}
      </div>
    </div>
  );
}

export default Modal;
