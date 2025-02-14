import React, { useState } from 'react';
import { SortingModal } from '../SortingModal/SortingModal';
import './SortingButton.styles.css';
import filter from "../../assets/filter.svg";

interface SortingButtonProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortingButton: React.FC<SortingButtonProps> = ({
  value,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSortLabel = () => {
    const sortLabels = {
      'distance': '가까운 순',
      'price_asc': '가격 낮은 순',
      'price_desc': '가격 높은 순'
    };
    return sortLabels[value as keyof typeof sortLabels] || '가까운 순';
  };

  return (
    <>
      <button 
        className="sorting-button"
        onClick={() => setIsModalOpen(true)}
      >
        <img src={filter} alt="filter" />
        <span className="sorting-label">{getSortLabel()}</span>
      </button>
      
      <SortingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSort={value}
        onSelect={onChange}
      />
    </>
  );
};