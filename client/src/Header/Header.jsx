import style from "./header.module.css";

function Header({ onTabChange, onThemeChange, theme }) {
  return (
    <header className={`${style.header}`}>
      <div className={`${style.logo}`} onClick={() => onTabChange("events")}>
        Event<span>ly</span>
      </div>
      <nav className={`${style.menu}`}>
        <button
          className={`${style.menuItem}`}
          onClick={() => onTabChange("events")}
        >
          Мероприятия
        </button>
        <button
          className={`${style.menuItem}`}
          onClick={() => onTabChange("registrations")}
        >
          Мои записи
        </button>
        <button
          className={`${style.menuItem}`}
          onClick={() => onThemeChange(!theme)}
        >
          <img src="./src/assets/icons/theme-button.svg" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
