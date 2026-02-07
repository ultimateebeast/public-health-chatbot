import { useState, useEffect } from "react";
import { ThemeContext } from "./index";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  return saved || "light";
}

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Save theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
