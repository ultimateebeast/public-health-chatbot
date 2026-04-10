import { Box, TextField, Button, Paper, Typography, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useThemeContext } from "../hooks/useThemeContext";

export default function ForgotPassword() {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        height: "100vh",
        background: mode === "light" 
           ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
           : "linear-gradient(135deg, #1f2025 0%, #15161a 100%)",
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
            padding: "50px 40px",
            borderRadius: "24px",
            background: mode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(35, 38, 45, 0.8)",
            backdropFilter: "blur(20px)",
            border: mode === "light" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: mode === "light" ? "0 25px 50px rgba(0, 0, 0, 0.15)" : "0 25px 50px rgba(0, 0, 0, 0.5)",
          }}>
          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 800,
              textAlign: "center",
              color: mode === "light" ? "#1a1a1a" : "#fff",
            }}>
            Reset Password
          </Typography>

          <Typography
            sx={{
              mb: 3,
              fontSize: "0.95rem",
              textAlign: "center",
              color: mode === "light" ? "#666" : "#aaa",
            }}>
            Enter your registered email and we’ll send you a password reset
            link to get back into the engine.
          </Typography>

          {/* Input Email */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            sx={{
              mb: 3,
              "& label": { color: mode === "light" ? "#555" : "#aaa" },
              "& input": { color: mode === "light" ? "#1a1a1a" : "#fff" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: mode === "light" ? "#e0e0e0" : "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: "#667eea" },
                "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 },
                background: mode === "light" ? "transparent" : "rgba(255,255,255,0.02)"
              },
            }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.8,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              textTransform: "none",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
              },
            }}>
            Send Reset Link
          </Button>

          {/* Back to Login */}
          <Typography
            sx={{
              mt: 4,
              textAlign: "center",
              fontSize: "14px",
              color: mode === "light" ? "#666" : "#aaa",
            }}>
            Remember your password?{" "}
            <Link
              href="/login"
              sx={{
                color: mode==="light"?"#667eea":"#8ba3ff",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}>
              Back to Login
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
