import shared from "../styles/shared.module.css";
import style from "../Card/card.module.css";
import { useState, useContext } from "react";
import Button from "../Button/Button";
import CardInput from "../Inputs/CardInput";
// import { EventsContext } from "../Context/EventsContext";
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
    // events,
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
  const [error, setError] = useState(null);

  const { events, loadEvents } = useEvents();

  // const { handleUpdateEvent } = useContext(EventsContext);

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
      alert("Мероприятие с таким именем уже существует.");
      return;
    }

    if (isPast) {
      alert("Указанная дата уже прошла. Пожалуйста, выберите другую дату.");
      return;
    }

    if (isNull) {
      alert("Количество участников должно быть больше 0.");
      return;
    }

    // handleUpdateEvent(updatedEvent);
    setLoading(true);
    try {
      await updateEvent(updatedEvent);
      await loadEvents();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

    onQuit();
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
        >
          <img src="./src/assets/icons/quit-button.svg" />
        </button>
        <button className={style.iconButton} type="button">
          <img src="./src/assets/icons/delete-button.svg" />
        </button>
        <CardInput
          name={"title"}
          value={title}
          placeholder={title}
          onChange={handleChange}
        />
        <CardInput
          name={"description"}
          value={description}
          placeholder={description}
          onChange={handleChange}
        />
      </div>
      <div className={`${shared.flexColumn} ${style.cardBottom}`}>
        <div className={style.cardInfo}>
          <div>
            <img src="./src/assets/icons/icon-date.svg" alt="Clock emoji" />
          </div>
          <CardInput
            name={"date"}
            value={date}
            type={"datetime-local"}
            onChange={handleChange}
          />
        </div>
        <div className={style.cardInfo}>
          <div>
            <img
              src="./src/assets/icons/icon-location.svg"
              alt="Location pin emoji"
            />
          </div>
          <CardInput
            name={"location"}
            value={location}
            placeholder={location}
            onChange={handleChange}
          />
        </div>
        <div className={style.cardInfo}>
          <CardInput
            name={"capacity"}
            value={capacity}
            placeholder={capacity}
            type={"number"}
            onChange={handleChange}
          />
        </div>
        <Button className={shared.buttonTransparent} type={"submit"}>
          Завершить редактирование
        </Button>
      </div>
    </form>
  );
}

export default EditForm;
