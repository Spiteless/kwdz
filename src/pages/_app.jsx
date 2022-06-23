import React from "react";
import "../styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ContextProvider } from "@context/AppContext";
import ThemeContext from "@context/CustomThemeContext";
import RouterContext from "@context/RouterContext";

function MyApp({ Component, pageProps }) {
  return (
    <RouterContext>
      <ThemeContext>
        <ContextProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </ContextProvider>
      </ThemeContext>
    </RouterContext>
  );
}

export default MyApp;
