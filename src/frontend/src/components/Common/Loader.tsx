import React from 'react';
import { CircularProgress, styled } from '@mui/material';

// Define the props for the Loader component
interface LoaderProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  thickness?: number;
  variant?: 'determinate' | 'indeterminate';
  value?: number;
}

// Create a styled component based on CircularProgress
const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  // Apply custom styles based on the theme
  color: theme.palette.primary.main,
  // Adjust size and thickness based on props in the component usage
}));

// Define the Loader component
const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
  variant = 'indeterminate',
  value = 0,
}) => {
  return (
    <StyledCircularProgress
      size={size}
      color={color}
      thickness={thickness}
      variant={variant}
      value={value}
    />
  );
};

export default Loader;

// TODO: Implement accessibility features for screen readers
// TODO: Add unit tests for the Loader component
// TODO: Create documentation for the Loader component usage