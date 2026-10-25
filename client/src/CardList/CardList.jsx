import style from "./card-list.module.css";
import Card from "../Card/Card";

function CardList({ tab }) {
  return (
    <div className={`events__cards ${style.cardsWrapper}`}>
      <Card tab={tab} />
    </div>
  );
}

export default CardList;
