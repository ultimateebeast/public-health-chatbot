import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useThemeContext } from "../hooks/useThemeContext";

export default function Landing() {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "40px 20px", md: "80px 60px" },
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
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
        {/* TITLE */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
            fontSize: { xs: "2.1rem", md: "3.2rem" },
            color: mode === "light" ? "#1a1a1a" : "#f5f5f5",
            mb: 2,
          }}>
          Smarter Health.
          <br />
          Powered by <span style={{ color: "#667eea" }}>Intelligence.</span>
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: mode === "light" ? "#666" : "#b0b0b0",
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                px: 4,
                py: 1.6,
                fontSize: "1.05rem",
                fontWeight: 600,
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                },
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
                border: "1px solid #667eea",
                color: "#667eea",
                textTransform: "none",
                "&:hover": {
                  background: "rgba(102, 126, 234, 0.1)",
                },
              }}>
              Login
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* RIGHT FLOATING AI ORB */}
      <motion.div
        style={{
          position: "absolute",
          right: 30,
          bottom: 50,
          zIndex: 1,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: 0.1,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
    </Box>
  );
}
