import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Signup() {
  const { signup, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}>
        <Box
          sx={{
            width: 420,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "50px 40px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}>
              <PersonAddIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
              }}>
              Create Account
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#666", mt: 1, textAlign: "center" }}>
              Join us to get started
            </Typography>
          </Box>

          {authError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                backgroundColor: "#ffebee",
                border: "1px solid #ef5350",
              }}>
              {authError}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                backgroundColor: "#ffebee",
                border: "1px solid #ef5350",
              }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "15px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f5576c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f5576c",
                    borderWidth: 2,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "15px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f5576c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f5576c",
                    borderWidth: 2,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "15px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f5576c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f5576c",
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.8,
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #e07bea 0%, #e3405b 100%)",
                  boxShadow: "0 12px 24px rgba(245, 87, 108, 0.4)",
                },
              }}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: "#666" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                sx={{
                  color: "#f5576c",
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
