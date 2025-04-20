// src/theme.js
import { createTheme } from '@mui/material/styles';

// Custom colors
const primaryColor = {
  main: '#1976d2',
  light: '#42a5f5',
  dark: '#1565c0',
  contrastText: '#ffffff',
};

const secondaryColor = {
  main: '#4a148c',
  light: '#7c43bd',
  dark: '#12005e',
  contrastText: '#ffffff',
};

const errorColor = {
  main: '#d32f2f',
  light: '#ef5350',
  dark: '#c62828',
  contrastText: '#ffffff',
};

const warningColor = {
  main: '#ed6c02',
  light: '#ff9800',
  dark: '#e65100',
  contrastText: '#ffffff',
};

const infoColor = {
  main: '#0288d1',
  light: '#03a9f4',
  dark: '#01579b',
  contrastText: '#ffffff',
};

const successColor = {
  main: '#2e7d32',
  light: '#4caf50',
  dark: '#1b5e20',
  contrastText: '#ffffff',
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    error: errorColor,
    warning: warningColor,
    info: infoColor,
    success: successColor,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.03)',
    '0px 3px 1px -2px rgba(0,0,0,0.05),0px 2px 2px 0px rgba(0,0,0,0.03),0px 1px 5px 0px rgba(0,0,0,0.03)',
    '0px 3px 3px -2px rgba(0,0,0,0.05),0px 3px 4px 0px rgba(0,0,0,0.03),0px 1px 8px 0px rgba(0,0,0,0.03)',
    '0px 2px 4px -1px rgba(0,0,0,0.05),0px 4px 5px 0px rgba(0,0,0,0.03),0px 1px 10px 0px rgba(0,0,0,0.03)',
    // Additional shadow levels can be customized as needed
    ...Array(20).fill(''),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          boxShadow: '0px 1px 5px 0px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0px 2px 8px 0px rgba(25, 118, 210, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.05)',
        }
      }
    }
  },
});

export default theme;