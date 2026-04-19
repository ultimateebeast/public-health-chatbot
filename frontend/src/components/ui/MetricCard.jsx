import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function MetricCard({ title, value, subtitle }) {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "150px",
        borderRadius: "20px",
        background:
          mode === "light"
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(35, 35, 35, 0.75)",
        backdropFilter: "blur(12px)",
        border:
          mode === "light"
            ? "1px solid rgba(255, 255, 255, 0.5)"
            : "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow:
          mode === "light"
            ? "0 10px 30px rgba(0, 0, 0, 0.05)"
            : "0 10px 30px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            mode === "light"
              ? "0 15px 40px rgba(102, 126, 234, 0.15)"
              : "0 15px 40px rgba(102, 126, 234, 0.3)",
          background:
            mode === "light"
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(45, 45, 45, 0.9)",
        },
      }}>
      <Typography
        sx={{
          fontSize: "0.95rem",
          opacity: 0.8,
          color: mode === "light" ? "#666" : "#a0a0a0",
          marginBottom: 0.5,
          fontWeight: 600,
        }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "2.4rem",
          fontWeight: 800,
          color: "#667eea",
          marginBottom: 0.5,
        }}>
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.9rem",
          opacity: 0.8,
          color: mode === "light" ? "#999" : "#909090",
        }}>
        {subtitle}
      </Typography>
    </Box>
  );
}
