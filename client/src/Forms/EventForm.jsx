import Input from "../Input/Input";
import Button from "../Button/Button";
import shared from "../styles/shared.module.css";

function EventForm() {
  return (
    <form>
      <Input title={"Название"} name={"title"} />
      <Input title={"Описание"} name={"description"} />
      <label className={shared.label}>
        Категория
        <select name="category" className={shared.select}>
          <option value="tech" defaultValue>
            tech
          </option>
          <option value="art">art</option>
          <option value="music">music</option>
        </select>
      </label>
      <Input title={"Дата и время"} name={"date"} type={"datetime-local"} />
      <Input title={"Место проведения"} name={"location"} />
      <Input
        title={"Количество участников"}
        name={"capacity"}
        type={"number"}
      />
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default EventForm;
