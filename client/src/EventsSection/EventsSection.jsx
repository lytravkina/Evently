import { useContext, useEffect, useRef, useState } from "react";
import CardList from "../CardList/CardList";
import shared from "../styles/shared.module.css";
import { PageContext } from "../Context/PageContext";

function EventsSection({ onButtonClick }) {
  const { currentEvents } = useContext(PageContext);

  const [search, setSearch] = useState(
    () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.search ?? "",
  );
  const [category, setCategory] = useState(
    () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.category ?? "",
  );

  const [sortingType, setSortingType] = useState(
    () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.sorting ?? null,
  );

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

  const sortedEvents = (type) => {
    const arr = [...matchesFilters];
    switch (type) {
      case "title-asc":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return arr.sort((a, b) => b.title.localeCompare(a.title));
      case "date-asc":
        return arr.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      case "date-desc":
        return arr.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      case "capacity-asc":
        return arr.sort((a, b) => a.capacity - b.capacity);
      case "capacity-desc":
        return arr.sort((a, b) => b.capacity - a.capacity);
      default:
        return arr;
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "FILTERS_KEY",
      JSON.stringify({ search, category, sorting: sortingType }),
    );
  }, [search, category, sortingType]);

  return (
    <section className={shared.flexColumn}>
      <div className={shared.flexRow}>
        <input
          type="text"
          placeholder="Поиск по названию и описанию..."
          value={search}
          className={shared.input}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={shared.select}
          value={category}
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
      <CardList
        events={sortedEvents(sortingType)}
        onButtonClick={onButtonClick}
        checked={sortingType}
        onCheck={setSortingType}
      />
    </section>
  );
}

export default EventsSection;
