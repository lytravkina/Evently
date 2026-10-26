import shared from "../styles/shared.module.css";
import style from "./card.module.css";

function Card({ tab }) {
  return (
    <article className={style.card}>
      <div className={style.cardWrapper}>
        <div className={`${shared.flexColumn} ${style.cardTop}`}>
          <div
            className={`${shared.subtitle} ${shared.subtitleBackground} ${style.cardSubtitle}`}
          ></div>
          <h2 className={`${shared.title} ${style.cardTitle}`}></h2>
          <p className={shared.description}></p>
          {tab === "events" && (
            <>
              <button className={`${style.iconButton} ${style.iconButtonLeft}`}>
                <img
                  className={shared.icon}
                  src="./src/assets/icons/edit-button.svg"
                />
              </button>
              <button className={style.iconButton}>
                <img
                  className={shared.icon}
                  src="./src/assets/icons/delete-button.svg"
                />
              </button>
            </>
          )}
        </div>
        <div className={`${shared.flexColumn} ${style.cardBottom}`}>
          <div className={style.cardInfo}>
            <div>
              <img
                className={style.icon}
                src="./src/assets/icons/icon-date.svg"
              />
            </div>
            <span className="date"></span>
          </div>
          <div className={style.cardInfo}>
            <div>
              <img
                className={style.icon}
                src="./src/assets/icons/icon-location.svg"
              />
            </div>
            <span className="location"></span>
          </div>
          <div className={style.cardInfo}>
            <span className="capacity">
              <span className="capacity__number"></span> мест
            </span>
          </div>
          <button
            className={`${style.button} ${tab === "registrations" && style.buttonTransparent}`}
          >
            {tab === "events" ? "Записаться" : "Отменить запись"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default Card;
