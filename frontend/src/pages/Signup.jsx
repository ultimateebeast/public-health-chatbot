import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useThemeContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Signup() {
  const { signup, error: authError } = useAuth();
  const { mode } = useThemeContext();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: mode === "light" 
           ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
           : "linear-gradient(135deg, #261623 0%, #201317 100%)",
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
            background: mode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(35, 25, 30, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "50px 40px",
            boxShadow: mode === "light" ? "0 25px 50px rgba(0, 0, 0, 0.2)" : "0 25px 50px rgba(0, 0, 0, 0.5)",
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
                fontWeight: 800,
                color: mode === "light" ? "#1a1a1a" : "#fff",
                textAlign: "center",
              }}>
              Create Account
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: mode === "light" ? "#666" : "#aaa", mt: 1, textAlign: "center" }}>
              Join the Beta to get started
            </Typography>
          </Box>

          {authError && <Alert severity="error" sx={{ mb: 3 }}>{authError}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            
            {/* Same styling as Login */}
            {[
               { label: "Email Address", type: "email", val: email, set: setEmail },
               { label: "Password", type: "password", val: password, set: setPassword },
               { label: "Confirm Password", type: "password", val: confirmPassword, set: setConfirmPassword }
            ].map((field, idx) => (
               <TextField
                 key={idx}
                 fullWidth
                 label={field.label}
                 type={field.type}
                 value={field.val}
                 onChange={(e) => field.set(e.target.value)}
                 sx={{
                   "& label": { color: mode === "light" ? "#555" : "#aaa" },
                   "& input": { color: mode === "light" ? "#1a1a1a" : "#fff" },
                   "& .MuiOutlinedInput-root": {
                     borderRadius: "12px",
                     fontSize: "15px",
                     "& fieldset": { borderColor: mode === "light" ? "#e0e0e0" : "rgba(255,255,255,0.1)" },
                     "&:hover fieldset": { borderColor: "#f5576c" },
                     "&.Mui-focused fieldset": { borderColor: "#f5576c", borderWidth: 2 },
                     background: mode === "light" ? "transparent" : "rgba(255,255,255,0.02)"
                   },
                 }}
               />
            ))}

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
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #e07bea 0%, #e3405b 100%)",
                  boxShadow: "0 12px 24px rgba(245, 87, 108, 0.4)",
                },
              }}>
              {loading ? "Creating account..." : "Sign Up for Beta"}
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: mode === "light" ? "#666" : "#aaa" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                sx={{
                  color: mode==="light"?"#f5576c":"#ff8597",
                  fontWeight: 600,
                  textDecoration: "none",
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
