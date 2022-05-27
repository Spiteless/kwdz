import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { ContextProvider } from "../context/AppContext";

import theme from "../themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
