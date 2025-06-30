import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Notifications,
  Settings,
  AccountCircle,
  NetworkCheck,
} from '@mui/icons-material';

interface HeaderProps {
  onNotificationClick: () => void;
  alertCount: number;
}

const Header: React.FC<HeaderProps> = ({ onNotificationClick, alertCount }) => {
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onNotificationClick}
            sx={{ color: 'white' }}
          >
            <Badge badgeContent={alertCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton sx={{ color: 'white' }}>
            <Settings />
          </IconButton>

          <Tooltip title="Account settings" arrow>
            <IconButton sx={{ color: 'white' }}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
