import React from 'react';
import './SortingModal.styles.css';

interface SortingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelect: (value: string) => void;
}

export const SortingModal: React.FC<SortingModalProps> = ({
  isOpen,
  onClose,
  selectedSort,
  onSelect,
}) => {
  if (!isOpen) return null;

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sortOptions = [
    { label: '가까운 순', value: 'distance' },
    { label: '가격 낮은 순', value: 'price_asc' },
    { label: '가격 높은 순', value: 'price_desc' }
  ];

  return (
    <div className="sorting-modal-overlay" onClick={handleOverlayClick}>
      <div className="sorting-modal-content">
        {sortOptions.map((option) => (
          <div 
            key={option.value}
            className="sorting-modal-item" 
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
            {selectedSort === option.value && (
              <img src="/icons/checkmark.svg" alt="check" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};