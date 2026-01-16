// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const defaultFont = localStorage.getItem("font") || "Arial"; // default font

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "corporate");
  const [font, setFont] = useState(defaultFont);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleFont = (newFont) => {
    setFont(newFont);
  };

  useEffect(() => {
    // For DaisyUI themes
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // For dark/light class (if needed for other components)
    // document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fontLinkId = "dynamic-font-link";

    // Remove existing font link
    const existing = document.getElementById(fontLinkId);
    if (existing) existing.remove();

    // Add new Google font link
    const link = document.createElement("link");
    link.id = fontLinkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replaceAll(
      " ",
      "+"
    )}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);

    // Apply to html
    document.documentElement.style.setProperty("--user-font", `'${font}', sans-serif`);
    localStorage.setItem("font", font);
  }, [font]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, font, toggleFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);