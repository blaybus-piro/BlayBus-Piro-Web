import React from 'react';
import './ConsultingTypeModal.styles.css';

interface ConsultingTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string;
  onSelect: (value: string) => void;
}

export const ConsultingTypeModal: React.FC<ConsultingTypeModalProps> = ({
  isOpen,
  onClose,
  selectedType,
  onSelect,
}) => {
  if (!isOpen) return null;

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // overlay를 클릭했을 때만 모달이 닫히도록 합니다
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="consulting-modal-overlay" onClick={handleOverlayClick}>
      <div className="consulting-modal-content">
        <div className="consulting-modal-item" onClick={() => handleSelect('offline')}>
          대면 컨설팅
          {selectedType === 'offline' && (
            <img src="/icons/checkmark.svg" alt="check" />
          )}
        </div>
        <div className="consulting-modal-item" onClick={() => handleSelect('online')}>
          비대면 컨설팅
          {selectedType === 'online' && (
            <img src="/icons/checkmark.svg" alt="check" />
          )}
        </div>
      </div>
    </div>
  );
};