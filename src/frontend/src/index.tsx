import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';
import store from './store';
import theme from './styles/theme';

// Import global styles if any
import './styles/index.css';

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

render();

// Enable hot module replacement for faster development
if (module.hot) {
  module.hot.accept('./App', () => {
    render();
  });
}

// List of human tasks (commented)
/*
Human tasks:
1. Confirm the correct path for importing the theme from styles/theme
2. Verify if any additional global styles or polyfills need to be imported
*/