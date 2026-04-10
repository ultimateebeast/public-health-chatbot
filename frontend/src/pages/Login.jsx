import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useThemeContext";

export default function Login() {
  const { login, error: authError, user } = useAuth();
  const { mode } = useThemeContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);

      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);
      } else {
        throw new Error("Token not received");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: mode === "light" 
           ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
           : "linear-gradient(135deg, #1f2025 0%, #15161a 100%)",
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
            background: mode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(35, 38, 45, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "50px 40px",
            boxShadow: mode === "light" ? "0 25px 50px rgba(0, 0, 0, 0.2)" : "0 25px 50px rgba(0, 0, 0, 0.4)",
            border: mode === "light" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
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
                fontWeight: 800,
                color: mode === "light" ? "#1a1a1a" : "#fff",
                textAlign: "center",
              }}>
              Welcome Back
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: mode === "light" ? "#666" : "#aaa", mt: 1, textAlign: "center" }}>
              Access your intelligent health core
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {authError}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
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
                "& label": { color: mode === "light" ? "#555" : "#aaa" },
                "& input": { color: mode === "light" ? "#1a1a1a" : "#fff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "15px",
                  "& fieldset": { borderColor: mode === "light" ? "#e0e0e0" : "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 },
                  background: mode === "light" ? "transparent" : "rgba(255,255,255,0.02)"
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
                "& label": { color: mode === "light" ? "#555" : "#aaa" },
                "& input": { color: mode === "light" ? "#1a1a1a" : "#fff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "15px",
                  "& fieldset": { borderColor: mode === "light" ? "#e0e0e0" : "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 },
                  background: mode === "light" ? "transparent" : "rgba(255,255,255,0.02)"
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.8,
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                  boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
                },
              }}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: mode === "light" ? "#666" : "#aaa" }}>
              Don't have an account?{" "}
              <Link
                href="/signup"
                sx={{
                  color: mode==="light"?"#667eea":"#8ba3ff",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}>
                Sign up for Beta
              </Link>
            </Typography>
            <Typography sx={{ fontSize: 13, color: mode === "light" ? "#999" : "#777", mt: 2 }}>
              <Link
                href="/forgot"
                sx={{
                  color: mode==="light"?"#667eea":"#8ba3ff",
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
