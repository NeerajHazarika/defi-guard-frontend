import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ThreatIntelligence from './pages/ThreatIntelligence';
import AddressScreening from './pages/AddressScreening';
import DeFiRiskAssessment from './pages/DeFiRiskAssessment';
import StablecoinMonitoring from './pages/StablecoinMonitoring';
import ScamAddressChecker from './pages/ScamAddressChecker';
import GlobalStablecoinMapNew from './pages/GlobalStablecoinMapNew';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [sidebarOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Header />
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
              <Route path="/" element={
                <ErrorBoundary>
                  <ThreatIntelligence />
                </ErrorBoundary>
              } />
              <Route path="/threat-intelligence" element={
                <ErrorBoundary>
                  <ThreatIntelligence />
                </ErrorBoundary>
              } />
              <Route path="/address-screening" element={
                <ErrorBoundary>
                  <AddressScreening />
                </ErrorBoundary>
              } />
              <Route path="/defi-risk-assessment" element={
                <ErrorBoundary>
                  <DeFiRiskAssessment />
                </ErrorBoundary>
              } />
              <Route path="/stablecoin-monitoring" element={
                <ErrorBoundary>
                  <StablecoinMonitoring />
                </ErrorBoundary>
              } />
              <Route path="/scam-address-checker" element={
                <ErrorBoundary>
                  <ScamAddressChecker />
                </ErrorBoundary>
              } />
              <Route path="/global-stablecoin-map-new" element={
                <ErrorBoundary>
                  <GlobalStablecoinMapNew />
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
