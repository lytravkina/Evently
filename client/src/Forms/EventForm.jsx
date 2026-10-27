import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";

function EventForm({ events }) {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "tech",
    date: "",
    location: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "capacity") {
      setEvent((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    setEvent((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  function handleEvent(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isExisting) {
      alert("Мероприятие с таким именем уже существует.");
      return;
    }

    if (isPast) {
      alert("Указанная дата уже прошла. Пожалуйста, выберите другую дату.");
      return;
    }

    if (isNull) {
      alert("Количество участников должно быть больше 0.");
      return;
    }

    console.log(event);
  }

  function validateForm() {
    const newErrors = {};

    if (!event.title.trim()) {
      newErrors.title = "Пожалуйста, введите название";
    }

    if (!event.description.trim()) {
      newErrors.description = "Пожалуйста, введите описание";
    }

    if (!event.date.trim()) {
      newErrors.date = "Пожалуйста, укажите дату и время";
    }

    if (!event.location.trim()) {
      newErrors.location = "Пожалуйста, укажите место проведения";
    }

    if (!event.capacity) {
      newErrors.capacity = "Пожалуйста, укажите количество участников";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const isExisting = events.some(
    (item) =>
      item.title.trim().toLowerCase() === event.title.trim().toLowerCase(),
  );

  const isPast = new Date(event.date).getTime() < Date.now();

  const isNull = event.capacity <= 0;

  return (
    <form onSubmit={handleEvent}>
      <Input
        title={"Название"}
        name={"title"}
        onChange={handleChange}
        isValid={!errors.title}
        error={errors.title}
      />
      <Input
        title={"Описание"}
        name={"description"}
        onChange={handleChange}
        isValid={!errors.description}
        error={errors.description}
      />
      <label className={shared.label}>
        Категория
        <select
          name="category"
          className={shared.select}
          value={event.category}
          onChange={handleChange}
        >
          <option value="tech">tech</option>
          <option value="art">art</option>
          <option value="music">music</option>
        </select>
      </label>
      <Input
        title={"Дата и время"}
        name={"date"}
        type={"datetime-local"}
        onChange={handleChange}
        isValid={!errors.date}
        error={errors.date}
      />
      <Input
        title={"Место проведения"}
        name={"location"}
        onChange={handleChange}
        isValid={!errors.location}
        error={errors.location}
      />
      <Input
        title={"Количество участников"}
        name={"capacity"}
        type={"number"}
        onChange={handleChange}
        isValid={!errors.capacity}
        error={errors.capacity}
      />
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default EventForm;
