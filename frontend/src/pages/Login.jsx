import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail("test@health.com");
    setPassword("Test123456");
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <Box
          sx={{
            width: 400,
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}>
              <LockIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
              }}>
              Welcome Back
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: "#666", mt: 1, textAlign: "center" }}>
              Access your health dashboard
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
            onSubmit={handleLogin}
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
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
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
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                  boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
                },
              }}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>

          {/* Test Account Helper */}
          <Box
            sx={{
              mt: 3,
              padding: "12px",
              borderRadius: "12px",
              background: "#f0f4ff",
              border: "1px solid #e0e7ff",
            }}>
            <Typography sx={{ fontSize: 12, color: "#666", mb: 1 }}>
              ?? Demo user - Click to fill:
            </Typography>
            <Button
              fullWidth
              size="small"
              onClick={fillTestCredentials}
              sx={{
                fontSize: 12,
                color: "#667eea",
                textTransform: "none",
                border: "1px solid #667eea",
                "&:hover": {
                  background: "#f0f4ff",
                },
              }}>
              Use Test Account (test@health.com)
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: "#666" }}>
              Don't have an account?{" "}
              <Link
                href="/signup"
                sx={{
                  color: "#667eea",
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}>
                Sign up
              </Link>
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#999", mt: 2 }}>
              <Link
                href="/forgot"
                sx={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: 500,
                }}>
                Forgot password?
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
