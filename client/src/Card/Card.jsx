import { useState, useContext } from "react";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";
import style from "./card.module.css";
import EditForm from "../Forms/EditForm";
import { EventsContext } from "../Context/EventsContext";
import { RegistrationsContext } from "../Context/RegistrationsContext";
import { useFormattedDate } from "../hooks/useFormattedDate";

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
    onButtonClick,
    onEdit,
    ...rest
  } = props;

  const { handleDeleteEvent } = useContext(EventsContext);
  const { handleDeleteRegistration } = useContext(RegistrationsContext);

  const formattedDate = useFormattedDate(date);

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
              onClick={() => handleDeleteEvent(id)}
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
          <span className="date">{formattedDate}</span>
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
          <Button
            onClick={() =>
              onButtonClick({ type: "open-registration-modal", payload: id })
            }
          >
            Записаться
          </Button>
        ) : (
          <Button
            className={shared.buttonTransparent}
            onClick={() => handleDeleteRegistration(id)}
          >
            Отменить запись
          </Button>
        )}
      </div>
    </>
  );
}
