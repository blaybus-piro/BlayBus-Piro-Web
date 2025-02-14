import React, { useState } from 'react';
import './Dropdown.styles.css';
import filter from "../../assets/filter.svg";

interface DropdownProps {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  defaultValue?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0].value);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button"
      >
        <img src={filter} alt="filter" />
        <span className="dropdown-label">가격 낮은 순</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-item ${option.value === selected ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {option.value === selected && (
                <img src="/icons/check.svg" alt="selected" className="check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};