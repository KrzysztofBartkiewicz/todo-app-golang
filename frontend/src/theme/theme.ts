import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#0F1726' : '#F4F5F7',
        paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
      },
      primary: {
        main: mode === 'dark' ? '#E5E7EB' : '#111827',
        contrastText: mode === 'dark' ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F8FAFC' : '#2B2F36',
        secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
        disabled: mode === 'dark' ? '#64748B' : '#9CA3AF',
      },
      divider: mode === 'dark' ? '#475569' : '#CBD5E1',
      action: {
        hover: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        selected: mode === 'dark' ? '#F8FAFC' : '#F3F4F6',
        disabled: mode === 'dark' ? '#64748B' : '#9CA3AF',
      },
    },

    typography: {
      fontFamily: `'Inter', 'Roboto', 'Arial', sans-serif`,
      h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      h4: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 10,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: '100vh',
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            width: 280,
            borderRight: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme.palette.text.primary,
          }),
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '1rem',
          },
          contained: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark' ? '#64748B' : '#000000',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#475569' : '#1F2937',
            },
          }),
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            backgroundColor: theme.palette.mode === 'dark' ? '#334155' : '#FFFFFF',
            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.12)',
          }),
          input: ({ theme }) => ({
            color: theme.palette.text.primary,
            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.mode === 'dark' ? '#475569' : '#E5E7EB',
          }),
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme.palette.text.primary,
          }),
          rounded: {
            borderRadius: 10,
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            padding: '12px 18px',
            color: theme.palette.text.primary,

            '&.Mui-selected': {
              backgroundColor: theme.palette.mode === 'dark' ? '#F8FAFC' : '#F3F4F6',
              color: '#111827',

              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#F8FAFC' : '#F3F4F6',
              },
            },
          }),
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
    },
  })
