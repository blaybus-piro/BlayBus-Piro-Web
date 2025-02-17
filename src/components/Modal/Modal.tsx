import React, { useState } from 'react';
import Button from '../Button/Button';
import './Modal.styles.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => Promise<void>;
    children: React.ReactNode;
    confirmText?: string;
    confirmVariant?: "primary" | "negative";
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    children,
    confirmText = "예약 취소",
    confirmVariant = "primary",
}) => {
    const overlayClass = ["modal-overlay", isOpen ? "visible" : "hidden"]
        .filter(Boolean)
        .join(" ");

    const contentClass = ["modal-content", isOpen ? "open" : "close"]
        .filter(Boolean)
        .join(" ");

    const [loading, setLoading] = useState(false);
    const handleConfirmClick = async () => {
        if (!onConfirm) return onClose();
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("취소 실패", error);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className={overlayClass}>
            <div className={contentClass}>
                <div className="modal-text">
                    {children}
                </div>
                <div className="modal-buttons">
                    <Button variant="secondary" size="large" onClick={onClose}>
                        아니요
                    </Button>
                    <Button
                        variant={confirmVariant}
                        size="large"
                        onClick={handleConfirmClick}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;