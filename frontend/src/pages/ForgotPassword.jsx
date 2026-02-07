import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useThemeContext } from "../hooks/useThemeContext";

export default function ForgotPassword() {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        height: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
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
          }}>
          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              textAlign: "center",
              color: "#1a1a1a",
            }}>
            Reset Password
          </Typography>

          <Typography
            sx={{
              mb: 3,
              fontSize: "0.95rem",
              textAlign: "center",
              opacity: 0.8,
              color: "#666",
            }}>
            Enter your registered email and we’ll send you a password reset
            link.
          </Typography>

          {/* Input Email */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
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
              mt: 3,
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#666",
            }}>
            Remember your password?{" "}
            <Box
              component="a"
              href="/login"
              sx={{
                color: "#667eea",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}>
              Back to Login
            </Box>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
