import { useState } from "react";
import style from "./header.module.css";

function Header({ onTabChange }) {
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
          onClick={() => onTabChange("registartions")}
        >
          Мои записи
        </button>
        <button className={`${style.menuItem}`}>
          <img className="icon__image" src="../assets/icons/theme-button.svg" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
