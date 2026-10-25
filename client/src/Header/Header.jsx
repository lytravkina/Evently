import { useState } from "react";
import style from "./header.module.css";

function Header() {
  return (
    <header className={`header ${style.header}`}>
      <div className={`logo ${style.logo}`}>
        Event<span>ly</span>
      </div>
      <nav className={`menu ${style.menu}`}>
        <button className={`menu__item menu__item_events ${style.menuItem}`}>
          Мероприятия
        </button>
        <button
          className={`menu__item menu__item_registrations ${style.menuItem}`}
        >
          Мои записи
        </button>
        <button className={`menu__item menu__item_theme ${style.menuItem}`}>
          <img className="icon__image" src="../assets/icons/theme-button.svg" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
