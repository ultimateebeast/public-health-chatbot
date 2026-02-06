import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#e3eeff,#f8fbff)",
        padding: { xs: "40px", md: "80px" },
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* GLOW BEHIND ORB */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          right: "-120px",
          top: "120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #0A84FF33, #0A84FF00)",
          filter: "blur(60px)",
        }}
      />

      {/* RIGHT FLOATING AI ORB */}
      <motion.img
        src="https://img.icons8.com/fluency/240/artificial-intelligence.png"
        width={380}
        style={{
          position: "absolute",
          right: 80,
          top: "22%",
          opacity: 0.25,
          filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.18))",
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* LEFT HERO CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ maxWidth: "650px", zIndex: 10 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: "1.2",
            color: "#0A0A0A",
            marginBottom: 2,
          }}>
          Your Health.
          <br />
          Powered by{" "}
          <span
            style={{ color: "#0A84FF", textShadow: "0 2px 10px #0A84FF33" }}>
            Intelligence.
          </span>
        </Typography>

        <Typography
          sx={{
            fontSize: "1.25rem",
            color: "#333",
            opacity: 0.95,
            maxWidth: "520px",
            marginBottom: 4,
            lineHeight: 1.6,
          }}>
          Experience healthcare assistance enhanced with advanced AI —
          beautifully designed with an Apple-grade smooth and modern interface.
        </Typography>

        {/* BUTTONS */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            component={Link}
            to="/chat"
            variant="contained"
            sx={{
              background: "#0A84FF",
              paddingX: 4,
              paddingY: 1.6,
              fontSize: "1.05rem",
              fontWeight: 600,
              borderRadius: "14px",
              boxShadow: "0 8px 25px rgba(0, 132, 255, 0.28)",
              textTransform: "none",
            }}>
            Try Assistant
          </Button>

          <Button
            component={Link}
            to="/login"
            sx={{
              paddingX: 4,
              paddingY: 1.6,
              fontSize: "1.05rem",
              fontWeight: 600,
              borderRadius: "14px",
              border: "2px solid #0A84FF",
              color: "#0A84FF",
              textTransform: "none",
              "&:hover": {
                background: "rgba(10,132,255,0.08)",
              },
            }}>
            Login
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
