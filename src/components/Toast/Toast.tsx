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
      }, 2000);

      const cleanupTimer = setTimeout(onClose, 2000);

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
