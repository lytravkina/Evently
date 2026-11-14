import shared from "../styles/shared.module.css";

function Button({ className, children, onClick, disabled, type = "button" }) {
  return (
    <button
      className={`${shared.button} ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
