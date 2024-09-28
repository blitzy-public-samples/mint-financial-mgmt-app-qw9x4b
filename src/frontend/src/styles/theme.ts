import { createTheme, ThemeOptions } from '@mui/material/styles';

const createCustomTheme = (): ThemeOptions => {
  // Define the color palette based on the Mint Replica design
  const palette = {
    primary: {
      main: '#1E88E5', // Blue
      light: '#64B5F6',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#43A047', // Green
      light: '#76D275',
      dark: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E53935', // Red
      light: '#FF6B6B',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFA000', // Amber
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    info: {
      main: '#2196F3', // Light Blue
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50', // Green
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
  };

  // Set up typography settings
  const typography = {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  };

  // Configure component overrides
  const components = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  };

  // Create and return the theme using createTheme function
  return createTheme({
    palette,
    typography,
    components,
    shape: {
      borderRadius: 8,
    },
  });
};

const theme = createCustomTheme();

export default theme;

// TODO: Review and adjust color palette to match exact brand guidelines
// TODO: Implement dark mode theme variant