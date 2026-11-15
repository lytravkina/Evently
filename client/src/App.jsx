import shared from "./styles/shared.module.css";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import EventsSection from "./EventsSection/EventsSection";
import Modal from "./Modal/Modal";
import { useModal } from "./store/pageStore";

function App() {
  const closeModal = useModal((state) => state.closeModal);
  const modalOpen = useModal((state) => state.modalOpen);
  const cardId = useModal((state) => state.cardId);

  return (
    <>
      <Header />

      <main className={shared.mainSection}>
        <Hero />
        <EventsSection />
      </main>

      {modalOpen && <Modal cardId={cardId} onClose={closeModal} />}
    </>
  );
}

export default App;
