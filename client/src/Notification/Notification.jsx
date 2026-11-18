import style from "./notification.module.css";

function Notification({ type, src, children, animation, onAnimationEnd }) {
  return (
    <div className={style.wrapper} onAnimationEnd={onAnimationEnd}>
      <div className={style.notification} data-animation={animation}>
        <img
          className={style.icon}
          src={src}
          aria-hidden="true"
          data-type={type}
        />
        <span>{children}</span>
      </div>
    </div>
  );
}

export default Notification;
