import React, { useState } from 'react';
import './Input.styles.css';

interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    placeholder = "",
    value = "",
    onChange,
    disabled = false,
    error = false,
    errorMessage = "",
    children,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const classNames = [
        "input-container",
        disabled ? 'disabled' : "",
        error ? "error" : "",
        value.length > 0 ? "filled" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classNames}>
            {children && <label className="input-label">{children}</label>}
            <input
                className="custom-input"
                type="text"
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "" : placeholder}
                disabled={disabled}
            />
            {error && errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Input;