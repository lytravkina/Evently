import { useState, useRef, useEffect } from "react";
import Input from "../Inputs/Input";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";
import { postEvent } from "../api/eventsAPI";
import { useEvents } from "../store/eventsStore";
import { useModal } from "../store/pageStore";
import { useNotification } from "../store/notificationStore";

function EventForm() {
  const { events, loadEvents } = useEvents();
  const closeModal = useModal((state) => state.closeModal);
  const [isLoading, setLoading] = useState(false);

  const setNotification = useNotification((state) => state.setNotification);
  const showNotification = useNotification((state) => state.showNotification);

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const locationRef = useRef("");
  const capacityRef = useRef("");

  const [event, setEvent] = useState({
    title: JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.title || "",
    description:
      JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.description || "",
    category:
      JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.category || "tech",
    date: JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.date || "",
    location:
      JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.location || "",
    capacity:
      JSON.parse(localStorage.getItem("FORM_DRAFT_KEY"))?.capacity || "",
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isExisting) {
      setNotification("Мероприятие с таким именем уже существует", "warning");
      showNotification();
      titleRef.current.focus();
      return;
    }

    if (isPast) {
      setNotification(
        "Указанная дата уже прошла. Пожалуйста, выберите другую дату",
        "warning",
      );
      showNotification();
      return;
    }

    if (isNull) {
      setNotification("Количество участников должно быть больше 0", "warning");
      showNotification();
      capacityRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      await postEvent(event);
      localStorage.removeItem("FORM_DRAFT_KEY");
      setEvent({
        title: "",
        description: "",
        category: "tech",
        date: "",
        location: "",
        capacity: "",
      });
      closeModal();
    } catch (e) {
      setNotification(
        "Не удалось создать мероприятие. Пожалуйста, повторите попытку",
        "error",
      );
      showNotification();
    } finally {
      await loadEvents();
      setLoading(false);
    }
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

  useEffect(() => {
    localStorage.setItem("FORM_DRAFT_KEY", JSON.stringify(event));
  }, [event]);

  return (
    <form className={shared.flexColumn} onSubmit={handleSubmit}>
      <Input
        title={"Название"}
        name={"title"}
        ref={titleRef}
        value={event.title}
        onChange={handleChange}
        isValid={!errors.title}
        error={errors.title}
      />
      <Input
        title={"Описание"}
        name={"description"}
        ref={descriptionRef}
        value={event.description}
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
        value={event.date}
        onChange={handleChange}
        isValid={!errors.date}
        error={errors.date}
      />
      <Input
        title={"Место проведения"}
        name={"location"}
        ref={locationRef}
        value={event.location}
        onChange={handleChange}
        isValid={!errors.location}
        error={errors.location}
      />
      <Input
        title={"Количество участников"}
        name={"capacity"}
        type={"number"}
        ref={capacityRef}
        value={event.capacity}
        onChange={handleChange}
        isValid={!errors.capacity}
        error={errors.capacity}
      />
      <Button type={"submit"} disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить"}
      </Button>
    </form>
  );
}

export default EventForm;
