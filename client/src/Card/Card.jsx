import { useState } from "react";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";
import style from "./card.module.css";

function Card({ id, isEditting, anyEditting, ...props }) {
  return (
    <article
      className={`${style.card} ${anyEditting && !isEditting ? style.disabled : ""}`}
      id={id}
    >
      <div className={style.cardWrapper}>
        {isEditting ? (
          <EditForm id={id} props={props} />
        ) : (
          <CardContent id={id} props={props} />
        )}
      </div>
    </article>
  );
}

function formatDate(string) {
  let [date, time] = string.split("T");

  const [year, month, day] = date.split("-");

  const [hour, minute] = time.split(":");

  const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;
  return formattedDate;
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
    onButtonClick,
    onEdit,
    ...rest
  } = props;

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
            <button className={style.iconButton}>
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
          <span className="date">{formatDate(date)}</span>
        </div>
        <div className={style.cardInfo}>
          <div>
            <img src="./src/assets/icons/icon-location.svg" />
          </div>
          <span className="location">{location}</span>
        </div>
        <div className={style.cardInfo}>
          <span className="capacity">
            <span className="capacity__number">{capacity}</span> мест
          </span>
        </div>

        {tab === "events" ? (
          <Button onClick={() => onButtonClick(id)}>Отправить</Button>
        ) : (
          <Button className={shared.buttonTransparent}>Отменить запись</Button>
        )}
      </div>
    </>
  );
}

function CardInput({ name, value, type = "text", onChange }) {
  return (
    <input
      className={shared.input}
      name={name}
      defaultValue={value}
      type={type}
      onChange={onChange}
    />
  );
}

function EditForm({ id, props }) {
  const {
    title,
    category,
    description,
    date,
    location,
    capacity,
    onQuit,
    events,
    ...rest
  } = props;

  const [updatedEvent, setUpdatedEvent] = useState({
    title,
    description,
    date,
    location,
    capacity,
  });

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

  function handleUpdatedEvent(e) {
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

    console.log(updatedEvent);
  }

  function completeEmptyInputs() {
    for (let [key, value] of Object.entries(updatedEvent)) {
      if (!value) {
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
    <form onSubmit={handleUpdatedEvent}>
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
        <CardInput name={"title"} value={title} onChange={handleChange} />
        <CardInput
          name={"description"}
          value={description}
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
            onChange={handleChange}
          />
        </div>
        <div className={style.cardInfo}>
          <CardInput
            name={"capacity"}
            value={capacity}
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

export default Card;
