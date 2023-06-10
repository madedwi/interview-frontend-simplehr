import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
  interface Theme{

  }
}

export const Theme = createTheme({
  typography: {
    fontSize: 14,
    h1: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 400,
    }
  }
})

