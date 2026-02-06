import { Box, TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Signup() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dce6f7, #eef4ff)", // theme match
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px)",
            borderRadius: "22px",
            padding: "40px 35px",
            width: "420px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}>
          {/* TITLE */}
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 800,
              color: "#111",
              textAlign: "center",
            }}>
            Create Account ✨
          </Typography>

          <Typography
            sx={{
              mb: 4,
              opacity: 0.75,
              textAlign: "center",
              fontSize: "1rem",
              maxWidth: "320px",
              margin: "0 auto",
            }}>
            Join Public Health AI and unlock personalized healthcare assistance.
          </Typography>

          {/* INPUT FIELDS */}
          <TextField
            fullWidth
            label="Name"
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
              },
            }}
          />

          {/* SIGNUP BUTTON */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              mt: 1,
              borderRadius: "14px",
              fontSize: "1.05rem",
              fontWeight: 600,
              background: "linear-gradient(135deg,#0A84FF,#4AB1FF)",
              boxShadow: "0 10px 20px rgba(10,132,255,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg,#006BE6,#0A84FF)",
              },
            }}>
            Sign Up
          </Button>

          {/* FOOTER LINK */}
          <Typography
            sx={{
              mt: 3,
              cursor: "pointer",
              textAlign: "center",
              fontSize: "0.95rem",
              opacity: 0.75,
              "&:hover": { opacity: 1 },
            }}
            onClick={() => (window.location.href = "/login")}>
            Already have an account? <strong>Login</strong>
          </Typography>
        </motion.div>
      </motion.div>
    </Box>
  );
}
