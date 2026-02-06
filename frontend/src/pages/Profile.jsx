import { Box, Typography, Avatar, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dce6f7, #eef4ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          width: "90%",
          maxWidth: "520px",
          padding: "45px 38px",
          borderRadius: "28px",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 25px 55px rgba(0,0,0,0.12)",
          textAlign: "center",
        }}>
        {/* AVATAR */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <Avatar
            src="https://img.icons8.com/color/96/user-male-circle--v1.png"
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              border: "3px solid rgba(255,255,255,0.8)",
            }}
          />
        </motion.div>

        {/* Name */}
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 800,
            mt: 2,
            color: "#111",
          }}>
          {user?.name || "User"}
        </Typography>

        {/* Email */}
        <Typography
          sx={{
            fontSize: "1.05rem",
            opacity: 0.75,
            mb: 3,
            color: "#333",
          }}>
          {user?.email || "email@example.com"}
        </Typography>

        {/* INFO CARD */}
        <Box
          sx={{
            background: "rgba(255,255,255,0.55)",
            padding: "25px",
            borderRadius: "20px",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            textAlign: "left",
            mb: 4,
          }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Account Information
          </Typography>

          <Typography sx={{ opacity: 0.85, mt: 2 }}>
            🌍 Role: <strong>{user?.role || "Student"}</strong>
          </Typography>

          <Typography sx={{ opacity: 0.85, mt: 1.2 }}>
            📅 Member Since: <strong>2024</strong>
          </Typography>

          <Typography sx={{ opacity: 0.85, mt: 1.2 }}>
            💼 Status: <strong>Active</strong>
          </Typography>
        </Box>

        {/* LOGOUT */}
        <Button
          variant="contained"
          onClick={logout}
          sx={{
            background: "linear-gradient(135deg,#FF4B4B,#FF6B6B)",
            "&:hover": {
              background: "linear-gradient(135deg,#D93838,#FF4B4B)",
            },
            padding: "12px 30px",
            fontSize: "1.05rem",
            fontWeight: 600,
            borderRadius: "14px",
            boxShadow: "0 12px 25px rgba(255,75,75,0.35)",
            textTransform: "none",
          }}>
          Logout
        </Button>
      </motion.div>
    </Box>
  );
}
