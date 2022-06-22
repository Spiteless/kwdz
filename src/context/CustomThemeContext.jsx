import React, { useContext, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import getTheme, { themes } from "src/themes/base";

const CustomThemeContext = React.createContext();

export function useThemeContext() {
  return useContext(CustomThemeContext);
}

export default function ThemeContext({ children }) {
  let currentTheme = getTheme(0);
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [num, setNum] = useState(1);

  const toggleTheme = (theme) => {
    let nextTheme;
    if (!!theme) {
      nextTheme = getTheme(theme);
      setNum(themes.reverseLookup[theme] + 1);
    } else {
      nextTheme = getTheme(num % themes.count);
      setNum(num + 1);
    }
    if (nextTheme) setActiveTheme(nextTheme);
    console.log(theme, `oldNum: ${num}, newNum: ${num+1}, calc: ${num % themes.count} `, activeTheme.name)

  };

  const exports = {
    activeTheme,
    setActiveTheme,
    toggleTheme,
  };

  return (
    <CustomThemeContext.Provider value={exports}>
      <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
}
