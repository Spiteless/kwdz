import { createTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF8F8F",
    },
    secondary: {
      main: "#5ABAA7",
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
    backgroundFocus: ({ratio, bg, box = 50}) => (
      `${((bg + (50 - box) / ratio - 50) * (ratio / (ratio - 1)) + 50) * 1}%`
    )
  }
}
);



export default theme;