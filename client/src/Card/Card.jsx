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

function CardInput({ name, value, type = "text" }) {
  return (
    <input
      className={shared.input}
      name={name}
      defaultValue={value}
      type={type}
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
    ...rest
  } = props;

  return (
    <form>
      <div className={`${shared.flexColumn} ${style.cardTop}`}>
        <div
          className={`${shared.subtitle} ${shared.subtitleBackground} ${style.cardSubtitle}`}
        >
          {category}
        </div>
        <button
          className={`${style.iconButton} ${style.iconButtonLeft}`}
          onClick={onQuit}
        >
          <img src="./src/assets/icons/quit-button.svg" />
        </button>
        <button className={style.iconButton} type="button">
          <img src="./src/assets/icons/delete-button.svg" />
        </button>
        <CardInput name={"title"} value={title} />
        <CardInput name={"description"} value={description} />
      </div>
      <div className={`${shared.flexColumn} ${style.cardBottom}`}>
        <div className={style.cardInfo}>
          <div>
            <img src="./src/assets/icons/icon-date.svg" alt="Clock emoji" />
          </div>
          <CardInput name={"date"} value={date} type={"datetime-local"} />
        </div>
        <div className={style.cardInfo}>
          <div>
            <img
              src="./src/assets/icons/icon-location.svg"
              alt="Location pin emoji"
            />
          </div>
          <CardInput name={"location"} value={location} />
        </div>
        <div className={style.cardInfo}>
          <CardInput name={"capacity"} value={capacity} type={"number"} />
        </div>
        <Button className={shared.buttonTransparent} type={"submit"}>
          Завершить редактирование
        </Button>
      </div>
    </form>
  );
}

export default Card;
