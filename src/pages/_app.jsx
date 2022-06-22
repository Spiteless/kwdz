import React from "react";
import "../styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ContextProvider } from "@context/AppContext";
import ThemeContext from "@context/CustomThemeContext";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeContext>
      <ContextProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ContextProvider>
    </ThemeContext>
  );
}

export default MyApp;
