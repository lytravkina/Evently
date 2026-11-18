import EventForm from "../Forms/EventForm";
import RegistrationForm from "../Forms/RegistrationForm";
import shared from "../styles/shared.module.css";
import style from "./modal.module.css";
import { useEvents } from "../store/eventsStore";
import { useNotification } from "../store/notificationStore";

function Modal({ cardId, onClose }) {
  const events = useEvents((state) => state.events);

  const setNotification = useNotification((state) => state.setNotification);
  const showNotification = useNotification((state) => state.showNotification);

  function handleClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    const formDraft = JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"));
    if (Object.keys(formDraft).length > 0 && !cardId) {
      setNotification("Черновик мероприятия сохранен", "success");
      showNotification();
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
          <button
            className={style.closeButton}
            onClick={(e) => handleClick(e)}
            aria-label="Закрыть диалоговое окно"
          >
            ×
          </button>
        </div>
        {cardId ? <RegistrationForm eventId={cardId} /> : <EventForm />}
      </div>
    </div>
  );
}

export default Modal;
