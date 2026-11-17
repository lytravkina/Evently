import style from "./notification.module.css";

function Notification({ type, src, children }) {
  return (
    <div className={style.notification}>
      <img
        className={style.icon}
        src={src}
        aria-hidden="true"
        data-type={type}
      />
      <span>{children}</span>
    </div>
  );
}

export default Notification;
