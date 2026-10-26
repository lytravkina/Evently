import shared from "../styles/shared.module.css";
import style from "./hero.module.css";

function Hero({ tab }) {
  return (
    <section className={`${shared.flexColumn}`}>
      <div className={`${shared.subtitle}`}>
        {tab === "events" ? "Мероприятия" : "Мои записи"}
      </div>
      <h1 className={`${shared.title} ${style.heroTitle}`}>
        {tab === "events"
          ? "Будь в центре событий"
          : "Твои планы на ближайшее время"}
      </h1>
      <p className={`${shared.description}`}>
        {tab === "events"
          ? "Выбирай интересное мероприятие и записывайся в пару кликов."
          : "Следи за предстоящими событиями и ничего не пропускай."}
      </p>
    </section>
  );
}

export default Hero;
