import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

import theme from "../themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
