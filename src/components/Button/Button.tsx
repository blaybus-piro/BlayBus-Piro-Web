import React, { useState } from "react";
import "./Button.styles.css";

interface ButtonProps {
  variant?: "primary" | "secondary" | "negative";
  size?: "large" | "medium" | "small" | "xsmall";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  icon,
  iconPosition,
  children,
  disabled = false,
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  // ✅ className을 배열로 관리하여 가독성 및 유지보수 개선
  const classNames = [
    "button",
    variant,
    size,
    disabled ? "disabled" : isPressed ? "pressed" : "",
    icon && iconPosition ? `icon-${iconPosition}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="icon">{icon}</span>}
    </button>
  );
};

export default Button;
