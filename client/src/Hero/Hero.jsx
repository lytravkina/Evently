import shared from "../styles/shared.module.css";
import style from "./hero.module.css";
import { usePage } from "../store/pageStore";

function Hero() {
  const activeTab = usePage((state) => state.activeTab);

  return (
    <section className={`${shared.flexColumn}`}>
      <div className={`${shared.subtitle}`}>
        {activeTab === "events" ? "Мероприятия" : "Мои записи"}
      </div>
      <h1 className={`${shared.title} ${style.heroTitle}`}>
        {activeTab === "events"
          ? "Будь в центре событий"
          : "Твои планы на ближайшее время"}
      </h1>
      <p className={`${shared.description}`}>
        {activeTab === "events"
          ? "Выбирай интересное мероприятие и записывайся в пару кликов."
          : "Следи за предстоящими событиями и ничего не пропускай."}
      </p>
    </section>
  );
}

export default Hero;
