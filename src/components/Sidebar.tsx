import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Security,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  { 
    text: 'Dashboard Overview', 
    icon: <Dashboard />, 
    path: '/',
    description: 'Main dashboard with key metrics'
  },
  { 
    text: 'Threat Intelligence', 
    icon: <Security />, 
    path: '/threat-intelligence',
    description: 'Live threat OSINT & security alerts'
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        position: 'fixed', // Keep sidebar fixed in place
        zIndex: (theme) => theme.zIndex.drawer,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 72,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          paddingTop: '64px', // Make room for the header
        },
      }}
    >
      <Box sx={{ mt: 8 }} />
      
      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Risk Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Comprehensive blockchain compliance
          </Typography>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'black',
                  '& .MuiListItemIcon-root': {
                    color: 'black',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 40 : 24,
                  color: location.pathname === item.path ? 'black' : 'text.primary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: location.pathname === item.path ? 'rgba(0, 0, 0, 0.7)' : 'text.secondary',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
