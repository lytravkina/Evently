import shared from "../styles/shared.module.css";
import style from "./input.module.css";

function Input({ title, name, type = "text", isValid, error, onChange }) {
  return (
    <label className={shared.label}>
      {title}
      <input
        className={`${shared.input} ${style.formInput} ${!isValid && shared.invalid}`}
        name={name}
        type={type}
        onChange={onChange}
      />
      {!isValid && <p className={style.error}>{error}</p>}
    </label>
  );
}

export default Input;
