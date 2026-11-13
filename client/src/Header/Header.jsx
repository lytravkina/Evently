import { useContext, useState, useEffect, useRef } from "react";
import style from "./header.module.css";
import { usePage } from "../store/pageStore";

function Header() {
  const { activeTab, setActiveTab } = usePage();

  const [themeIsDark, setTheme] = useState(
    () => JSON.parse(localStorage.getItem("THEME_KEY")) ?? false,
  );

  useEffect(() => {
    localStorage.setItem("TAB_KEY", JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeIsDark ? "dark" : "light";
    localStorage.setItem("THEME_KEY", JSON.stringify(themeIsDark));
  }, [themeIsDark]);

  return (
    <header className={`${style.header}`}>
      <div className={`${style.logo}`} onClick={() => setActiveTab("events")}>
        Event<span>ly</span>
      </div>
      <nav className={`${style.menu}`}>
        <button
          className={`${style.menuItem}`}
          onClick={() => setActiveTab("events")}
        >
          Мероприятия
        </button>
        <button
          className={`${style.menuItem}`}
          onClick={() => setActiveTab("registrations")}
        >
          Мои записи
        </button>
        <button
          className={`${style.menuItem}`}
          onClick={() => setTheme(!themeIsDark)}
        >
          <img src="./src/assets/icons/theme-button.svg" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
