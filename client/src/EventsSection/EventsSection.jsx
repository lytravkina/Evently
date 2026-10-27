import { useState } from "react";
import CardList from "../CardList/CardList";
import shared from "../styles/shared.module.css";

function EventsSection({ tab, events, error, onButtonClick }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = events.reduce((categories, event) => {
    if (!categories.includes(event.category)) {
      categories.push(event.category);
    }
    return categories;
  }, []);

  const matchesSearch = events.filter((event) => {
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
          className={shared.input}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" defaultValue>
            Все категории
          </option>
          {categories.map((category) => (
            <option value={category} defaultValue>
              {category}
            </option>
          ))}
        </select>
      </div>
      <CardList
        tab={tab}
        events={matchesFilters}
        error={error}
        onButtonClick={onButtonClick}
      />
    </section>
  );
}

export default EventsSection;
