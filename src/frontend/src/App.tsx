import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';
import theme from './styles/theme';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {isAuthenticated && <Sidebar />}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <AppRoutes />
            </Box>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

// TODO: Implement proper error boundary for the entire application
// TODO: Set up analytics tracking for the main app component