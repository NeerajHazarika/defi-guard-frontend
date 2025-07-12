import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  NetworkCheck,
} from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(22, 27, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NetworkCheck sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            DeFi Guard
          </Typography>
          <Chip 
            label="Risk Management Platform" 
            size="small" 
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'black',
              fontWeight: 600,
            }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
