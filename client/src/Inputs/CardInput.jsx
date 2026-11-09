import shared from "../styles/shared.module.css";

function CardInput({ name, value, placeholder, type = "text", onChange }) {
  return (
    <input
      className={shared.input}
      name={name}
      defaultValue={value}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
}

export default CardInput;
