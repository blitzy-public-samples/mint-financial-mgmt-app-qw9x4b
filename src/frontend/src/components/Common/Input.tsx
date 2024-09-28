import React from 'react';
import styled from '@emotion/styled';

// Define the props interface for the Input component
interface InputProps {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Create a styled input element
const StyledInput = styled.input<{ hasError: boolean }>`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${props => props.hasError ? '#E53935' : '#ccc'};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${props => props.hasError ? '#E53935' : '#1E88E5'};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Create a styled error message element
const ErrorMessage = styled.span`
  color: #E53935;
  font-size: 14px;
  margin-top: 4px;
  display: block;
`;

// Define the Input component
const Input: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error
}) => {
  return (
    <div>
      <StyledInput
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        hasError={!!error}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default Input;