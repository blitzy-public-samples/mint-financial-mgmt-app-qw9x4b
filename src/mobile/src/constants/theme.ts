// Theme constants for the Mint Replica mobile application

// Color palette
export const colors = {
  primary: '#1E88E5',
  secondary: '#43A047',
  accent: '#FFA000',
  background: '#FFFFFF',
  text: '#333333',
  error: '#E53935',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  disabled: '#BDBDBD',
};

// Typography settings
export const typography = {
  fontFamily: {
    regular: 'Roboto-Regular',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    extraLarge: 24,
  },
  lineHeight: {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 40,
  },
};

// Spacing values for consistent layout
export const spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// Border radius values for UI elements
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 9999,
};

// Shadow styles for elevated components
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Export all theme constants as a single object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and adjust color palette to ensure it meets accessibility standards (WCAG 2.1)
2. Confirm font family names with the design team and ensure they are correctly linked in the project
*/