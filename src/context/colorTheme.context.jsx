import { createContext, useEffect, useState, useContext } from "react";

export const ColorThemeContext = createContext({
  theme: "",
  setTheme: () => {},
});

export const ColorThemeState = () => {
  return useContext(ColorThemeContext);
};

const themePreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const ColorThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    themePreference()
      ? sessionStorage.getItem("theme") || "dark"
      : sessionStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const context = {
    theme,
    setTheme,
  };
  return (
    <ColorThemeContext.Provider value={context}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export default ColorThemeContextProvider;
