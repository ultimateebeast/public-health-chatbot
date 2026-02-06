import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { mode } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "40px 20px", md: "80px 60px" },
        background:
          mode === "light"
            ? "linear-gradient(to bottom right, #f5f9ff, #e6eeff)"
            : "linear-gradient(to bottom right, #0d0d0d, #1a1a1a)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* LEFT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{ maxWidth: "600px", zIndex: 2 }}>
        {/* RESPONSIVE TITLE */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
            fontSize: { xs: "2.1rem", md: "3.2rem" },
            color: mode === "light" ? "#111" : "#fff",
            mb: 2,
          }}>
          Smarter Health.
          <br />
          Powered by <span style={{ color: "#0A84FF" }}>Intelligence.</span>
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: mode === "light" ? "#333" : "#ccc",
            opacity: 0.9,
            maxWidth: "500px",
            mb: 4,
          }}>
          AI-driven health assistance crafted with precision. Get insights,
          reports, and answers instantly — anywhere, anytime.
        </Typography>

        {/* BUTTONS */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              component={Link}
              to="/chat"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg,#0A84FF,#4AB1FF)",
                px: 4,
                py: 1.6,
                fontSize: "1.05rem",
                fontWeight: 600,
                borderRadius: "12px",
                boxShadow: "0 8px 25px rgba(0, 132, 255, 0.25)",
              }}>
              Try Assistant
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              component={Link}
              to="/login"
              sx={{
                px: 4,
                py: 1.6,
                fontSize: "1.05rem",
                fontWeight: 600,
                borderRadius: "12px",
                border:
                  mode === "light" ? "1px solid #0A84FF" : "1px solid #4AB1FF",
                color: mode === "light" ? "#0A84FF" : "#4AB1FF",
              }}>
              Login
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* RIGHT FLOATING AI ORB */}
      <motion.img
        src="https://img.icons8.com/fluency/240/artificial-intelligence.png"
        width={350}
        style={{
          position: "absolute",
          right: 30,
          bottom: 50,
          opacity: mode === "light" ? 0.15 : 0.25,
          zIndex: 1,
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: mode === "light" ? 0.15 : 0.25, scale: 1 }}
        transition={{ duration: 1.4 }}
      />

      {/* MOBILE SIZE AI ORB */}
      <motion.img
        src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
        width={120}
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          opacity: mode === "light" ? 0.2 : 0.35,
          display: { xs: "block", md: "none" },
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </Box>
  );
}
