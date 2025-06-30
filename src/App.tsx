import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import ThreatIntelligence from './pages/ThreatIntelligence';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [sidebarOpen] = useState(true);
  const [alertCount] = useState(12);

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Header 
            onNotificationClick={handleNotificationClick}
            alertCount={alertCount}
          />
          <Sidebar open={sidebarOpen} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: 'background.default',
              minHeight: '100vh',
              pt: 8, // Account for AppBar height
              ml: sidebarOpen ? '280px' : '72px',
              transition: 'margin-left 0.3s ease',
              width: {
                xs: `calc(100% - ${sidebarOpen ? '280px' : '72px'})`,
                sm: `calc(100% - ${sidebarOpen ? '280px' : '72px'})`,
              },
              overflow: 'auto',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/threat-intelligence" element={
                <ErrorBoundary>
                  <ThreatIntelligence />
                </ErrorBoundary>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
