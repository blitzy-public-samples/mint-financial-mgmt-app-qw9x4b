import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../styles/theme';

// Extend the MuiButtonProps to include our custom props
interface ButtonProps extends MuiButtonProps {
  fullWidth?: boolean;
}

// Create a styled component based on MuiButton
const StyledButton = styled(MuiButton)<ButtonProps>(({ theme, size, fullWidth }) => ({
  // Apply custom styles based on the theme
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.button.fontWeight,
  textTransform: 'none',

  // Adjust padding, margin, and font sizes based on the 'size' prop
  ...(size === 'small' && {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.875rem',
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1, 2),
    fontSize: '1rem',
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.5, 3),
    fontSize: '1.125rem',
  }),

  // Implement custom hover and focus styles
  '&:hover': {
    opacity: 0.8,
  },
  '&:focus': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },

  // Apply fullWidth style when the 'fullWidth' prop is true
  ...(fullWidth && {
    width: '100%',
  }),
}));

// Define the Button component that renders StyledButton
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
```

This implementation creates a customized Button component based on Material-UI's Button component with the following features:

1. It imports necessary dependencies, including React, Material-UI components, and the custom theme.
2. It extends the MuiButtonProps interface to include the `fullWidth` prop.
3. It creates a `StyledButton` component using the `styled` function from Material-UI, applying custom styles based on the theme and props.
4. The styling includes adjustments for different sizes, custom hover and focus styles, and a fullWidth option.
5. The main `Button` component is defined as a functional component that renders the `StyledButton` with all props passed through.
6. The component is exported as the default export.

Note: Since the actual theme implementation was not available, I made assumptions about the theme structure. You may need to adjust the styling to match your specific theme once it's implemented.

Human Tasks:
```
# Human Tasks:
- Implement custom animations for button interactions (Optional)
- Add unit tests for the Button component (Required)