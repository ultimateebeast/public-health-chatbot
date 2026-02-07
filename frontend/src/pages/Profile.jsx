import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useThemeContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          width: "90%",
          maxWidth: "520px",
          padding: "50px 40px",
          borderRadius: "20px",
          background:
            mode === "light"
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(35, 35, 35, 0.9)",
          backdropFilter: "blur(10px)",
          border:
            mode === "light"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(102, 126, 234, 0.2)",
          boxShadow:
            mode === "light"
              ? "0 25px 50px rgba(0, 0, 0, 0.15)"
              : "0 25px 50px rgba(102, 126, 234, 0.2)",
          textAlign: "center",
        }}>
        {/* AVATAR */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              margin: "0 auto",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px rgba(102, 126, 234, 0.3)",
            }}>
            <Typography sx={{ fontSize: 50, color: "white" }}>👤</Typography>
          </Box>
        </motion.div>

        {/* Name */}
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            mt: 3,
            color: mode === "light" ? "#1a1a1a" : "#f5f5f5",
          }}>
          {user?.displayName || "User"}
        </Typography>

        {/* Email */}
        <Typography
          sx={{
            fontSize: "1.05rem",
            opacity: 0.7,
            mb: 3,
            color: mode === "light" ? "#666" : "#b0b0b0",
          }}>
          {user?.email || "email@example.com"}
        </Typography>

        {/* INFO CARD */}
        <Box
          sx={{
            background:
              mode === "light" ? "#f0f4ff" : "rgba(102, 126, 234, 0.1)",
            padding: "20px",
            borderRadius: "14px",
            border:
              mode === "light"
                ? "1px solid #e0e7ff"
                : "1px solid rgba(102, 126, 234, 0.2)",
            textAlign: "left",
            mb: 4,
          }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              color: mode === "light" ? "#1a1a1a" : "#f5f5f5",
            }}>
            Account Information
          </Typography>

          <Typography
            sx={{
              opacity: 0.8,
              mt: 2,
              color: mode === "light" ? "#333" : "#c0c0c0",
            }}>
            🌍 Status: <strong>Active</strong>
          </Typography>

          <Typography
            sx={{
              opacity: 0.8,
              mt: 1.2,
              color: mode === "light" ? "#333" : "#c0c0c0",
            }}>
            📅 Member Since: <strong>2024</strong>
          </Typography>

          <Typography
            sx={{
              opacity: 0.8,
              mt: 1.2,
              color: mode === "light" ? "#333" : "#c0c0c0",
            }}>
            💼 Plan: <strong>Standard</strong>
          </Typography>
        </Box>

        {/* LOGOUT */}
        <Button
          variant="contained"
          onClick={logout}
          sx={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #FF4B4B 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #FF5555 0%, #D93838 100%)",
              boxShadow: "0 8px 16px rgba(255, 75, 75, 0.3)",
            },
            padding: "12px 32px",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(255, 75, 75, 0.2)",
            textTransform: "none",
            color: "white",
          }}>
          Logout
        </Button>
      </motion.div>
    </Box>
  );
}
