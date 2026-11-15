import style from "./spinner.module.css";

function Spinner() {
  return (
    <div className={style.spinner}>
      <img src="./src/assets/icons/icon-spinner.svg" />
    </div>
  );
}

export default Spinner;
