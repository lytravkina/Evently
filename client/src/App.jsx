import { useEffect, useState, useRef, useContext, useReducer } from "react";
import shared from "./styles/shared.module.css";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import EventsSection from "./EventsSection/EventsSection";
import Modal from "./Modal/Modal";

function App() {
  function modalReducer(state, action) {
    switch (action.type) {
      case "open-registration-modal":
        return { modalOpen: true, cardId: action.payload };
      case "open-event-modal":
        return { modalOpen: true, cardId: null };
      case "close-modal":
        return { modalOpen: false, cardId: null };
    }
  }

  const [state, dispatch] = useReducer(modalReducer, {
    modalOpen: false,
    cardId: null,
  });

  return (
    <>
      <Header />

      <main className={shared.mainSection}>
        <Hero />
        <EventsSection onButtonClick={dispatch} />
      </main>

      {state.modalOpen && (
        <Modal
          cardId={state.cardId}
          onClose={() => dispatch({ type: "close-modal" })}
        />
      )}
    </>
  );
}

export default App;
