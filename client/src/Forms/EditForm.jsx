import shared from "../styles/shared.module.css";
import style from "../Card/card.module.css";
import { useEffect, useState } from "react";
import { useNotification } from "../store/notificationStore";
import Button from "../Button/Button";
import CardInput from "../Inputs/CardInput";
import { updateEvent } from "../api/eventsAPI";
import { useEvents } from "../store/eventsStore";

function EditForm({ id, props }) {
  const {
    title,
    category,
    description,
    date,
    location,
    capacity,
    onQuit,
    ...rest
  } = props;

  const [updatedEvent, setUpdatedEvent] = useState({
    id,
    title,
    description,
    date,
    location,
    capacity,
  });
  const [isLoading, setLoading] = useState(false);

  const setNotification = useNotification((state) => state.setNotification);
  const showNotification = useNotification((state) => state.showNotification);

  const { events, loadEvents } = useEvents();

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "capacity") {
      setUpdatedEvent((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    completeEmptyInputs();

    if (isExisting) {
      setNotification("Мероприятие с таким именем уже существует", "warning");
      showNotification();
      return;
    }

    if (isPast) {
      setNotification(
        "Указанная дата уже прошла. Пожалуйста, выберите другую дату",
        "warning",
      );
      showNotification();
      return;
    }

    if (isNull) {
      setNotification("Количество участников должно быть больше 0", "warning");
      showNotification();
      return;
    }

    setLoading(true);
    try {
      await updateEvent(updatedEvent);
      onQuit();
    } catch {
      setNotification(
        "Произошла непредвиденная ошибка. Пожалуйста, повторите попытку",
        "error",
      );
      showNotification();
    } finally {
      setLoading(false);
      await loadEvents();
    }
  }

  function completeEmptyInputs() {
    for (let [key, value] of Object.entries(updatedEvent)) {
      if (!String(value)) {
        updatedEvent[key] = props[key];
      }
    }
  }

  const isExisting = events
    .filter((event) => event.id !== id)
    .some(
      (event) =>
        event.title.trim().toLowerCase() ===
        updatedEvent.title.trim().toLowerCase(),
    );

  const isPast = new Date(updatedEvent.date).getTime() < Date.now();

  const isNull = updatedEvent.capacity <= 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className={`${shared.flexColumn} ${style.cardTop}`}>
        <div
          className={`${shared.subtitle} ${shared.subtitleBackground} ${style.cardSubtitle}`}
        >
          {category}
        </div>
        <button
          className={`${style.iconButton} ${style.iconButtonLeft}`}
          type="button"
          onClick={onQuit}
          aria-label="Выйти из режима редактирования"
        >
          <img aria-hidden="true" src="./src/assets/icons/quit-button.svg" />
        </button>
        <button
          className={style.iconButton}
          type="button"
          aria-label="Удалить мероприятие"
          disabled
        >
          <img aria-hidden="true" src="./src/assets/icons/delete-button.svg" />
        </button>
        <CardInput
          name={"title"}
          value={title}
          placeholder={title}
          onChange={handleChange}
          ariaLabel="Название мероприятия"
        />
        <CardInput
          name={"description"}
          value={description}
          placeholder={description}
          onChange={handleChange}
          ariaLabel="Описание мероприятия"
        />
      </div>
      <div className={`${shared.flexColumn} ${style.cardBottom}`}>
        <div className={style.cardInfo}>
          <div>
            <img
              aria-hidden="true"
              src="./src/assets/icons/icon-date.svg"
              alt="Clock emoji"
            />
          </div>
          <CardInput
            name={"date"}
            value={date}
            type={"datetime-local"}
            onChange={handleChange}
            ariaLabel="Дата и время проведения"
          />
        </div>
        <div className={style.cardInfo}>
          <div>
            <img
              aria-hidden="true"
              src="./src/assets/icons/icon-location.svg"
              alt="Location pin emoji"
            />
          </div>
          <CardInput
            name={"location"}
            value={location}
            placeholder={location}
            onChange={handleChange}
            ariaLabel="Место проведения"
          />
        </div>
        <div className={style.cardInfo}>
          <CardInput
            name={"capacity"}
            value={capacity}
            placeholder={capacity}
            type={"number"}
            onChange={handleChange}
            ariaLabel="Количество участников"
          />
        </div>
        <Button
          className={shared.buttonTransparent}
          disabled={isLoading}
          type={"submit"}
        >
          {isLoading ? "Отправка..." : "Завершить редактирование"}
        </Button>
      </div>
    </form>
  );
}

export default EditForm;
