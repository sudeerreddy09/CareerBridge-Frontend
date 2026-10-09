import { Link } from "react-router-dom";

function Button({
  children,
  to,
  variant = "primary",
  className = "",
}) {
  if (to) {
    return (
      <Link
        to={to}
        className={`cb-button cb-button-${variant} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`cb-button cb-button-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;