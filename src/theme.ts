import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      riskColors: {
        low: string;
        medium: string;
        high: string;
        critical: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      riskColors?: {
        low?: string;
        medium?: string;
        high?: string;
        critical?: string;
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00D4AA',
      light: '#33DCBB',
      dark: '#00A085',
    },
    secondary: {
      main: '#FF6B9D',
      light: '#FF8FB3',
      dark: '#E6548A',
    },
    background: {
      default: '#0A0E1A',
      paper: '#161B2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B8DB',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FF9800',
    },
    success: {
      main: '#4CAF50',
    },
  },
  custom: {
    riskColors: {
      low: '#4CAF50',
      medium: '#FF9800', 
      high: '#FF5722',
      critical: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      color: '#B3B8DB',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#B3B8DB',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});
