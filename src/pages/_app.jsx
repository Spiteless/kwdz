import "../styles/globals.css";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from "@context/AppContext";

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
