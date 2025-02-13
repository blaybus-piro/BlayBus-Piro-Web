import React from 'react';
import Button from '../Button/Button';
import './Modal.styles.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    children: React.ReactNode;
    confirmText?: string;
    confirmVariant?: "primary" | "negative";
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    children,
    confirmText = "확인",
    confirmVariant = "primary",
}) => {
    if (!isOpen) return null;

    const overlayClass = ["modal-overlay", isOpen ? "visible" : "hidden"]
        .filter(Boolean)
        .join(" ");

    const contentClass = ["modal-content", isOpen ? "open" : "close"]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={overlayClass}>
            <div className={contentClass}>
                <div className="modal-text">
                    {children}
                </div>
                <div className="modal-buttons">
                    <Button variant="secondary" size="large" onClick={onClose}>
                        취소
                    </Button>
                    <Button variant={confirmVariant} size="large" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;