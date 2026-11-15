import { useRef, useState } from "react";
import style from "./sorting.module.css";
import shared from "../styles/shared.module.css";
import Button from "../Button/Button";

function Sorting({ checked, onCheck }) {
  const [dialogShown, setDialog] = useState(false);
  const dialogRef = useRef("");

  function handleDialog(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    setTimeout(() => {
      setDialog(!dialogShown);
    }, 300);

    if (dialogShown) {
      dialogRef.current.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
        350,
      );
    }
  }

  return (
    <>
      <button className={style.iconButton} onClick={handleDialog}>
        <img src="./src/assets/icons/sort-button.svg" onClick={handleDialog} />
      </button>

      {dialogShown && (
        <div className={style.outerContainer} onClick={handleDialog}>
          <div className={style.sidebar} ref={dialogRef}>
            <p>Сортировать по:</p>
            <div className={style.form}>
              <label>
                <input
                  type="checkbox"
                  name="date-asc"
                  checked={checked === "date-asc"}
                  onChange={() => onCheck("date-asc")}
                />
                Сначала новые
              </label>
              <label>
                <input
                  type="checkbox"
                  name="date-desc"
                  checked={checked === "date-desc"}
                  onChange={() => onCheck("date-desc")}
                />
                Сначала старые
              </label>
              <label>
                <input
                  type="checkbox"
                  name="title-asc"
                  checked={checked === "title-asc"}
                  onChange={() => onCheck("title-asc")}
                />
                По названию A-Z
              </label>
              <label>
                <input
                  type="checkbox"
                  name="title-desc"
                  checked={checked === "title-desc"}
                  onChange={() => onCheck("title-desc")}
                />
                По названию Z-A
              </label>
              <label>
                <input
                  type="checkbox"
                  name="capacity-asc"
                  checked={checked === "capacity-desc"}
                  onChange={() => onCheck("capacity-desc")}
                />
                Больше свободных мест
              </label>
              <label>
                <input
                  type="checkbox"
                  name="capacity-desc"
                  checked={checked === "capacity-asc"}
                  onChange={() => onCheck("capacity-asc")}
                />
                Меньше свободных мест
              </label>
            </div>
            <Button type="button" onClick={handleDialog}>
              Показать мероприятия
            </Button>
            <Button
              type="button"
              className={shared.buttonTransparent}
              onClick={() => onCheck()}
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sorting;
