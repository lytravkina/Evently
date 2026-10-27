import shared from "../styles/shared.module.css";
import style from "./input.module.css";

function Input({ title, name, type = "text", value = "" }) {
  return (
    <>
      <label className={shared.label}>
        {title}
        <input
          className={`${shared.input} ${style.formInput}`}
          name={name}
          type={type}
        />
      </label>
      <p className={style.error}></p>
    </>
  );
}

export default Input;
