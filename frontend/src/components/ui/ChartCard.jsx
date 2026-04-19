import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function ChartCard({ title, children, sx = {} }) {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        padding: 4,
        borderRadius: "24px",
        background:
          mode === "light"
             ? "linear-gradient(135deg, rgba(234, 240, 255, 0.6) 0%, rgba(255,255,255,0.9) 100%)" 
             : "linear-gradient(135deg, rgba(30, 35, 45, 0.8) 0%, rgba(10, 15, 20, 0.9) 100%)",
        backdropFilter: "blur(12px)",
        border:
          mode === "light"
            ? "1px solid rgba(255, 255, 255, 0.5)"
            : "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow:
          mode === "light" ? "0 10px 30px rgba(0, 0, 0, 0.03)" : "0 8px 32px rgba(0,0,0,0.2)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: mode === "light" ? "#1a1a1a" : "#fff",
          mb: 3,
        }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 300 }}>{children}</Box>
    </Box>
  );
}
