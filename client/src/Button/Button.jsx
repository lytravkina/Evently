import shared from "../styles/shared.module.css";

function Button({ className, children, onClick, type = "button" }) {
  return (
    <button
      className={`${shared.button} ${className || ""}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
