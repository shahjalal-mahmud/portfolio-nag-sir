import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
      className="btn btn-circle text-xl bg-base-200 hover:bg-base-300 transition duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-500" />}
    </button>
  );
};

export default ThemeToggle;