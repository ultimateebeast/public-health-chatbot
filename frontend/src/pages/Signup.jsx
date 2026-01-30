import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Signup() {
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
            Create Account
          </Typography>

          <TextField fullWidth label="Name" sx={{ mb: 3 }} />
          <TextField fullWidth label="Email" sx={{ mb: 3 }} />
          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 3 }}
          />

          <Button fullWidth variant="contained" sx={{ py: 1.5 }}>
            Sign Up
          </Button>

          <Typography
            sx={{ mt: 2, cursor: "pointer" }}
            onClick={() => (window.location.href = "/login")}>
            Already have an account? Login
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
