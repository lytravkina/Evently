import Input from "../Input/Input";
import Button from "../Button/Button";

function RegistrationForm() {
  return (
    <form>
      <Input title={"Имя"} name={"name"} />
      <Input title={"Email"} name={"email"} type={"email"} />
      <Button type={"submit"}>Отправить</Button>
    </form>
  );
}

export default RegistrationForm;
