import React, { useState } from 'react';
import { ConsultingTypeModal } from '../HomeModal/ConsultingTypeModal';
import './ConsultingTypeButton.styles.css';

interface ConsultingTypeButtonProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConsultingTypeButton: React.FC<ConsultingTypeButtonProps> = ({
  value,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonContent = () => {
    // 값이 있을 때만 선택된 스타일 적용
    if (value === 'offline' || value === 'online') {
      return {
        text: value === 'offline' ? '대면 컨설팅' : '비대면 컨설팅',
        className: 'consulting-type-button selected'
      };
    }
    
    // 기본 상태
    return {
      text: '컨설팅 타입',
      className: 'consulting-type-button'
    };
  };

  const buttonContent = getButtonContent();

  return (
    <>
      <button 
        className={buttonContent.className}
        onClick={() => setIsModalOpen(true)}
      >
        {buttonContent.text}
        <img src="/icons/consulting-dropdown.svg" alt="dropdown" />
      </button>
      
      <ConsultingTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedType={value}
        onSelect={onChange}
      />
    </>
  );
};