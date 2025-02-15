import React, { useEffect, useState } from "react";
import "./Toast.styles.css";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500); // 1.5초 후 사라짐

      const cleanupTimer = setTimeout(onClose, 2000); // 2초 후 완전히 언마운트

      return () => {
        clearTimeout(timer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [isVisible, onClose]);

  return (
    <div className={`toast ${visible ? "visible" : ""}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
