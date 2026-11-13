import Input from "../Inputs/Input";
import Button from "../Button/Button";
import { useState, useContext, useRef } from "react";
import { postRegistration } from "../api/registrationsAPI";
import { updateEvent } from "../api/eventsAPI";
import { useEvents } from "../store/eventsStore";
import { useRegistrations } from "../store/registrationsStore";

function RegistrationForm({ eventId, onRegistrationPost }) {
  const { registrations, loadRegistrations } = useRegistrations();
  const { events, loadEvents } = useEvents();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      alert("Вы уже записаны на данное мероприятие.");
      return;
    }

    if (isFull) {
      alert(
        "Лимит участников достигнут. Пожалуйста, выберите другое мероприятие.",
      );
      return;
    }

    if (isPast) {
      alert(
        "Данное мероприятие уже закончилось. Пожалуйста, выберите другое мероприятие.",
      );
      return;
    }

    setLoading(true);
    try {
      await postRegistration(registration);
      const eventToUpdate = events.find((event) => event.id === eventId);
      await updateEvent({
        ...eventToUpdate,
        capacity: eventToUpdate.capacity - 1,
      });
      await Promise.all([loadEvents(), loadRegistrations()]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

    onRegistrationPost({ type: "close-modal" });
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
    <form onSubmit={handleSubmit}>
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
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default RegistrationForm;
