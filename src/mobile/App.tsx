import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';
import { store } from './src/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

// TODO: Implement error boundary for the entire app
// TODO: Set up app-wide error logging service
// TODO: Implement deep linking configuration (Optional)

/**
 * App Component
 * 
 * This is the root component of the Mint Replica mobile application.
 * It sets up the app's theme, state management, and navigation structure.
 * 
 * The component wraps the entire application with necessary providers:
 * 1. Redux Provider for state management
 * 2. ThemeProvider for consistent theming across the app
 * 3. PaperProvider for Material Design components
 * 
 * The AppNavigator component is rendered as the root component, which will
 * handle all the navigation within the app.
 * 
 * @returns {JSX.Element} The rendered App component
 */