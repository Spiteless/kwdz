import React from "react";
import "../styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import AppContext from "@context/AppContext";
import ThemeContext from "@context/CustomThemeContext";
import RouterContext from "@context/RouterContext";

function MyApp({ Component, pageProps }) {
  return (
    <RouterContext>
      <ThemeContext>
        <AppContext>
          <CssBaseline />
          <Component {...pageProps} />
        </AppContext>
      </ThemeContext>
    </RouterContext>
  );
}

export default MyApp;
