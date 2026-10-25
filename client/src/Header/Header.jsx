import { useState } from 'react'
import style from './header.module.css'

function Header() {

  return (
        <header className={style.header} >
          <div className="logo">Event<span>ly</span></div>
          <nav className="menu">
            <button className="menu__item menu__item_events">Мероприятия</button>
            <button className="menu__item menu__item_registrations">Мои записи</button>
            <button className="menu__item menu__item_theme">
              <img className="icon__image" src="../assets/icons/theme-button.svg"/>
            </button>
          </nav>
        </header>
  )
}

export default Header
