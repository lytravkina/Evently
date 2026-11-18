import Input from "../Inputs/Input";
import Button from "../Button/Button";
import { useState, useRef, useEffect } from "react";
import { postRegistration } from "../api/registrationsAPI";
import { updateEvent } from "../api/eventsAPI";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";
import { useModal } from "../store/pageStore";
import { useNotification } from "../store/notificationStore";
import shared from "../styles/shared.module.css";

function RegistrationForm({ eventId }) {
  const closeModal = useModal((state) => state.closeModal);
  const { registrations, loadRegistrations } = useRegistrations();
  const { events, loadEvents } = useEvents();

  const [isLoading, setLoading] = useState(false);

  const setNotification = useNotification((state) => state.setNotification);
  const showNotification = useNotification((state) => state.showNotification);

  const nameRef = useRef("");
  const emailRef = useRef("");

  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    eventId,
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });

    setRegistration((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isRegistered) {
      setNotification("Вы уже записаны на данное мероприятие", "warning");
      showNotification();
      return;
    }

    if (isFull) {
      setNotification(
        "Лимит участников достигнут. Пожалуйста, выберите другое мероприятие",
        "warning",
      );
      showNotification();
      return;
    }

    if (isPast) {
      setNotification(
        "Данное мероприятие уже закончилось. Пожалуйста, выберите другое мероприятие",
        "warning",
      );
      showNotification();
      return;
    }

    setLoading(true);
    try {
      const eventToUpdate = events.find((event) => event.id === eventId);
      await postRegistration(registration);
      await updateEvent({
        ...eventToUpdate,
        capacity: eventToUpdate.capacity - 1,
      });
      closeModal();
    } catch {
      setNotification(
        "Возникла непредвиденная ошибка. Пожалуйста, повторите попытку",
        "error",
      );
      showNotification();
    } finally {
      setLoading(false);
      await Promise.all([loadEvents(), loadRegistrations()]);
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!registration.email.trim()) {
      newErrors.email = "Пожалуйста, введите ваш Email";
      emailRef.current.value = "";
      emailRef.current.focus();
    }

    if (!registration.name.trim()) {
      newErrors.name = "Пожалуйста, введите ваше имя";
      nameRef.current.value = "";
      nameRef.current.focus();
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const isRegistered = registrations.some(
    (registration) => registration.eventId === eventId,
  );

  const isFull = events.find((event) => event.id === eventId).capacity === 0;

  const isPast =
    new Date(events.find((event) => event.id === eventId).date).getTime() <
    Date.now();

  return (
    <form className={shared.flexColumn} onSubmit={handleSubmit}>
      <Input
        title={"Имя"}
        name={"name"}
        ref={nameRef}
        isValid={!errors.name}
        error={errors.name || ""}
        onChange={handleChange}
      />
      <Input
        title={"Email"}
        name={"email"}
        type={"email"}
        ref={emailRef}
        isValid={!errors.email}
        error={errors.email || ""}
        onChange={handleChange}
      />
      <Button type={"submit"} disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить"}
      </Button>
    </form>
  );
}

export default RegistrationForm;
