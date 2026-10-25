import shared from "../styles/shared.module.css";
import style from "./hero.module.css";

function Hero() {
  return (
    <section className={`hero ${shared.flexColumn}`}>
      <div className={`hero__subtitle subtitle ${shared.subtitle}`}>
        Мероприятия
      </div>
      <h1 className={`hero__title title ${shared.title} ${style.heroTitle}`}>
        Будь в центре событий
      </h1>
      <p className={`hero__description description ${shared.description}`}>
        Выбирай интересное мероприятие и записывайся в пару кликов.
      </p>
    </section>
  );
}

export default Hero;
