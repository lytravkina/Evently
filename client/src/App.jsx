import shared from "./styles/shared.module.css";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import EventsSection from "./EventsSection/EventsSection";
import Modal from "./Modal/Modal";
import Notification from "./Notification/Notification";
import { useModal } from "./store/pageStore";
import { useNotification } from "./store/notificationStore";

function App() {
  const closeModal = useModal((state) => state.closeModal);
  const modalOpen = useModal((state) => state.modalOpen);
  const cardId = useModal((state) => state.cardId);

  const notificationText = useNotification((state) => state.text);
  const notificationType = useNotification((state) => state.type);
  const notificationActive = useNotification((state) => state.active);
  const notificationIcon = useNotification((state) => state.icon);

  return (
    <>
      {notificationActive && (
        <Notification
          type={notificationType}
          src={`./src/assets/icons/icon-${notificationType}.svg`}
        >
          {notificationText}
        </Notification>
      )}
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
