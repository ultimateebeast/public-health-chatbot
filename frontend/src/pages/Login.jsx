import { Box, TextField, Button, Paper, Typography } from "@mui/material";
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
        height: "100vh",
        background: "linear-gradient(135deg,#0A84FF,#2EE59D)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}>
        <Paper
          sx={{ width: 420, padding: 4, borderRadius: "18px" }}
          elevation={12}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Login
          </Typography>

          <TextField fullWidth label="Email" sx={{ mb: 3 }} />
          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={handleSubmit}>
            Sign In
          </Button>

          <Typography
            sx={{ mt: 2, cursor: "pointer" }}
            onClick={() => (window.location.href = "/signup")}>
            Don’t have an account? Sign Up
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
