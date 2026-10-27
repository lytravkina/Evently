import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

function RegistrationForm({ events, registrations, eventId }) {
  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    eventId: eventId,
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setRegistration((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  function handleRegistration(e) {
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

    console.log(registration);
  }

  function validateForm() {
    const newErrors = {};

    if (!registration.name.trim()) {
      newErrors.name = "Пожалуйста, введите ваше имя";
    }

    if (!registration.email.trim()) {
      newErrors.email = "Пожалуйста, введите ваш Email";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const isRegistered = registrations.some(
    (registration) => registration.eventId === eventId,
  );

  const isFull = events.find((event) => event.id === eventId).capacity === 0;

  return (
    <form onSubmit={handleRegistration}>
      <Input
        title={"Имя"}
        name={"name"}
        isValid={!errors.name}
        error={errors.name || ""}
        onChange={handleChange}
      />
      <Input
        title={"Email"}
        name={"email"}
        type={"email"}
        isValid={!errors.email}
        error={errors.email || ""}
        onChange={handleChange}
      />
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default RegistrationForm;
