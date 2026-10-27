import EventForm from "../Forms/EventForm";
import RegistrationForm from "../Forms/RegistrationForm";
import shared from "../styles/shared.module.css";
import style from "./modal.module.css";

function Modal({ onClose, cardId, events }) {
  return (
    <div className={style.modal} onClick={(e) => onClose(e)}>
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
          <button className={style.closeButton} onClick={(e) => onClose(e)}>
            ×
          </button>
        </div>
        {cardId ? <RegistrationForm /> : <EventForm />}
      </div>
    </div>
  );
}

export default Modal;
