import { useContext, useState, useEffect, useRef } from "react";
import style from "./header.module.css";
import { PageContext } from "../Context/PageContext";
import { usePage } from "../store/pageStore";

function Header() {
  const { setActiveTab } = useContext(PageContext);
  // const setActiveTab = usePage((state) => state.setActiveTab);

  const [themeIsDark, setTheme] = useState(
    () => JSON.parse(localStorage.getItem("THEME_KEY")) ?? false,
  );

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
