import { useContext, useState } from "react";
import CardList from "../CardList/CardList";
import shared from "../styles/shared.module.css";
import { PageContext } from "../Context/PageContext";

function EventsSection({ onButtonClick }) {
  const { currentEvents } = useContext(PageContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = currentEvents.reduce((categories, event) => {
    if (!categories.includes(event.category)) {
      categories.push(event.category);
    }
    return categories;
  }, []);

  const matchesSearch = currentEvents.filter((event) => {
    return (
      event.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      event.description.toLowerCase().includes(search.trim().toLowerCase())
    );
  });

  const matchesFilters = matchesSearch.filter((event) => {
    return category ? event.category === category : event;
  });

  return (
    <section className={shared.flexColumn}>
      <div className={shared.flexRow}>
        <input
          type="text"
          placeholder="Поиск по названию и описанию..."
          className={shared.input}
          onInput={(e) => setSearch(e.target.value)}
        />
        <select
          className={shared.select}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <CardList events={matchesFilters} onButtonClick={onButtonClick} />
    </section>
  );
}

export default EventsSection;
