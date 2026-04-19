import { Box } from "@mui/material";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function GlassCard({ children, glow, sx = {} }) {
  const { mode } = useThemeContext();
  
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: mode === "light" 
          ? "rgba(255, 255, 255, 0.6)" 
          : "rgba(30, 30, 30, 0.4)",
        backdropFilter: "blur(20px)",
        border: mode === "light"
          ? "1px solid rgba(102, 126, 234, 0.2)"
          : "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: glow 
          ? (mode === "light" ? "0 10px 40px rgba(102, 126, 234, 0.2)" : "0 10px 40px rgba(102, 126, 234, 0.3)") 
          : (mode === "light" ? "0 10px 30px rgba(0, 0, 0, 0.03)" : "0 8px 32px rgba(0,0,0,0.2)"),
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: mode === "light" 
            ? "0 15px 40px rgba(102, 126, 234, 0.3)" 
            : "0 15px 40px rgba(102, 126, 234, 0.4)",
          background: mode === "light" 
            ? "rgba(255, 255, 255, 0.9)" 
            : "rgba(45, 45, 45, 0.7)",
        },
        ...sx,
      }}>
      {children}
    </Box>
  );
}
