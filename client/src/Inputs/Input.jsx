import shared from "../styles/shared.module.css";
import style from "./input.module.css";

function Input({
  title,
  name,
  type = "text",
  ref,
  isValid,
  error,
  onChange,
  value,
}) {
  return (
    <label className={shared.label}>
      {title}
      <input
        className={`${shared.input} ${style.formInput} ${!isValid && shared.invalid}`}
        name={name}
        type={type}
        ref={ref}
        onChange={onChange}
        value={value}
      />
      {!isValid && <p className={style.error}>{error}</p>}
    </label>
  );
}

export default Input;
