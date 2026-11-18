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
  const notificationAnimation = useNotification((state) => state.animation);
  const hideNotification = useNotification((state) => state.hideNotification);

  return (
    <>
      {notificationActive && (
        <Notification
          type={notificationType}
          animation={notificationAnimation ? "show" : "hide"}
          src={`./src/assets/icons/icon-${notificationType}.svg`}
          onAnimationEnd={(e) => {
            if (!notificationAnimation) {
              hideNotification();
            }
          }}
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
