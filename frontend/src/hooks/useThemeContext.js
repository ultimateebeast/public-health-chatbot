import { useContext } from "react";
import { ThemeContext } from "../context/index";

export const useThemeContext = () => useContext(ThemeContext);
