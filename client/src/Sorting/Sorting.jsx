import { useRef, useState } from "react";
import style from "./sorting.module.css";
import shared from "../styles/shared.module.css";
import Button from "../Button/Button";

function Sorting({ checked, onCheck }) {
  const [animation, setAnimation] = useState(true);
  const [dialogShown, setDialog] = useState(false);

  function openDialog() {
    if (!dialogShown) {
      setDialog(true);
      setAnimation(true);
    }
  }

  function hideDialog(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    setAnimation(false);
  }

  // function handleDialog(e) {
  //   if (e.target !== e.currentTarget) {
  //     return;
  //   }

  //   setTimeout(() => {
  //     setDialog(!dialogShown);
  //   }, 300);

  //   if (dialogShown) {
  //     dialogRef.current.animate(
  //       [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
  //       350,
  //     );
  //   }
  // }

  return (
    <>
      <button
        className={style.iconButton}
        onClick={openDialog}
        aria-label="Сортировать список"
      >
        <img
          src="./src/assets/icons/sort-button.svg"
          onClick={openDialog}
          aria-hidden="true"
        />
      </button>

      {dialogShown && (
        <div className={style.outerContainer} onClick={hideDialog}>
          <div
            className={style.sidebar}
            data-animation={animation ? "show" : "hide"}
            onAnimationEnd={() => {
              if (!animation) {
                setDialog(false);
              }
            }}
          >
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
            <Button type="button" onClick={hideDialog}>
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
