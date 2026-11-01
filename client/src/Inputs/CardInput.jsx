import shared from "../styles/shared.module.css";

function CardInput({ name, value, type = "text", onChange }) {
  return (
    <input
      className={shared.input}
      name={name}
      defaultValue={value}
      type={type}
      onChange={onChange}
    />
  );
}

export default CardInput;
