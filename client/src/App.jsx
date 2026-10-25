import { useState } from "react";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import CardList from "./CardList/CardList";

function App() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <>
      <Header onTabChange={setActiveTab} />

      <main className="events-page">
        <Hero tab={activeTab} />
        <section className="events">
          <div className="events__filters">
            <form className="filters-form form">
              <input
                type="text"
                placeholder="Поиск по названию и описанию..."
                className="filters-form__input input"
              />
              <select className="filters-form__select select">
                <option className="filters-form__default" value="" defaultValue>
                  Все категории
                </option>
              </select>
            </form>
          </div>
          <CardList tab={activeTab} />
        </section>
      </main>
    </>
  );
}

export default App;
