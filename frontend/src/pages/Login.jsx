import { Box, TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();

  const handleSubmit = () => {
    login({
      email: "test@example.com",
      name: "Test User",
      role: "student",
    });
    window.location.href = "/dashboard";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dce6f7, #eef4ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}>
      {/* FADE-IN WRAPPER */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
        {/* FLOATING GLASS CARD */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(22px) saturate(180%)",
            borderRadius: "26px",
            padding: "45px 38px",
            width: "420px",
            boxShadow: "0 25px 55px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.45)",
          }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 800,
              color: "#0A0A0A",
              textAlign: "center",
            }}>
            Welcome Back 👋
          </Typography>

          <Typography
            sx={{
              mb: 4,
              opacity: 0.7,
              textAlign: "center",
              fontSize: "1rem",
              color: "#333",
            }}>
            Sign in to continue to your health dashboard
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.85)",
              },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{
              mb: 1,
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.85)",
              },
            }}
          />

          {/* Forgot Password */}
          <Typography
            sx={{
              textAlign: "right",
              mb: 2,
              fontSize: "0.9rem",
              opacity: 0.7,
              cursor: "pointer",
              "&:hover": { opacity: 1 },
            }}
            onClick={() => (window.location.href = "/forgot")}>
            Forgot Password?
          </Typography>

          {/* Login Button */}
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
              boxShadow: "0 12px 25px rgba(10,132,255,0.32)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg,#006BE6,#0A84FF)",
              },
            }}
            onClick={handleSubmit}>
            Sign In
          </Button>

          {/* CTA */}
          <Typography
            sx={{
              mt: 3,
              cursor: "pointer",
              textAlign: "center",
              fontSize: "0.95rem",
              opacity: 0.7,
              "&:hover": { opacity: 1 },
            }}
            onClick={() => (window.location.href = "/signup")}>
            Don’t have an account? <strong>Sign Up</strong>
          </Typography>
        </motion.div>
      </motion.div>
    </Box>
  );
}
