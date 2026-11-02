import { useContext, useState, useRef } from "react";
import Input from "../Inputs/Input";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";
import { EventsContext } from "../Context/EventsContext";

function EventForm({ events, onEventPost }) {
  const { handlePostEvent } = useContext(EventsContext);

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const locationRef = useRef("");
  const capacityRef = useRef("");

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

    setErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });

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

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isExisting) {
      alert("Мероприятие с таким именем уже существует.");
      titleRef.current.focus();
      return;
    }

    if (isPast) {
      alert("Указанная дата уже прошла. Пожалуйста, выберите другую дату.");
      return;
    }

    if (isNull) {
      alert("Количество участников должно быть больше 0.");
      capacityRef.current.focus();
      return;
    }

    handlePostEvent(event);
    onEventPost();
  }

  function validateForm() {
    const newErrors = {};

    if (!String(event.capacity)) {
      newErrors.capacity = "Пожалуйста, укажите количество участников";
      capacityRef.current.value = "";
      capacityRef.current.focus();
    }

    if (!event.location.trim()) {
      newErrors.location = "Пожалуйста, укажите место проведения";
      locationRef.current.value = "";
      locationRef.current.focus();
    }

    if (!event.date.trim()) {
      newErrors.date = "Пожалуйста, укажите дату и время";
    }

    if (!event.description.trim()) {
      newErrors.description = "Пожалуйста, введите описание";
      descriptionRef.current.value = "";
      descriptionRef.current.focus();
    }

    if (!event.title.trim()) {
      newErrors.title = "Пожалуйста, введите название";
      titleRef.current.value = "";
      titleRef.current.focus();
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
    <form onSubmit={handleSubmit}>
      <Input
        title={"Название"}
        name={"title"}
        ref={titleRef}
        onChange={handleChange}
        isValid={!errors.title}
        error={errors.title}
      />
      <Input
        title={"Описание"}
        name={"description"}
        ref={descriptionRef}
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
        ref={locationRef}
        onChange={handleChange}
        isValid={!errors.location}
        error={errors.location}
      />
      <Input
        title={"Количество участников"}
        name={"capacity"}
        type={"number"}
        ref={capacityRef}
        onChange={handleChange}
        isValid={!errors.capacity}
        error={errors.capacity}
      />
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default EventForm;
