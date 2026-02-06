import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #0A84FF, #23D5AB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}>
      {/* Glass Card Animation */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}>
        <Paper
          elevation={0}
          sx={{
            width: 420,
            padding: 4,
            borderRadius: "22px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(18px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.40)",
            boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
          }}>
          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              textAlign: "center",
              color: "#fff",
              textShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}>
            Reset Password
          </Typography>

          <Typography
            sx={{
              mb: 3,
              fontSize: "0.95rem",
              textAlign: "center",
              opacity: 0.9,
              color: "#f1f1f1",
            }}>
            Enter your registered email and we’ll send you a password reset
            link.
          </Typography>

          {/* Input Email */}
          <TextField
            fullWidth
            label="Enter your email"
            sx={{
              mb: 3,
              background: "rgba(255,255,255,0.75)",
              borderRadius: "12px",
              "& fieldset": { border: "none" },
            }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              fontSize: "1rem",
              background: "#007AFF",
              borderRadius: "12px",
              boxShadow: "0 6px 18px rgba(0,122,255,0.35)",
              "&:hover": { background: "#0063D9" },
            }}>
            Send Reset Link
          </Button>

          {/* Back to login */}
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: "#fff",
              opacity: 0.9,
              cursor: "pointer",
              "&:hover": { opacity: 1 },
            }}
            onClick={() => (window.location.href = "/login")}>
            Back to Login
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
