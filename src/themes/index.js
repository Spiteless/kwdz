import { createTheme } from '@mui/material/styles';
import { orange, yellow, grey, green, purple } from '@mui/material/colors';




const theme = createTheme({
  palette: {
    primary: {
      main: "#0096FF",
    },
    secondary: {
      main: "#ff9100",
    },
    dark: {
      main: grey[900],
      900: grey[900],
      800: grey[800],
      700: grey[700],
      600: grey[600],
      500: grey[500],
      400: grey[400],
      300: grey[300],
      200: grey[200],
      100: grey[100],
    },
    light: {
      main: grey[50]
    }
  },
  utils: {
    backgroundFocus: ({ ratio, bg, box = 50 }) => (
      `${((bg + (50 - box) / ratio - 50) * (ratio / (ratio - 1)) + 50) * 1}%`
    )
  }
}
);



export default theme;