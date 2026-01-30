import { Box, IconButton, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        width: open ? "220px" : "70px",
        transition: "0.3s",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(12px)",
        height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.2)",
        paddingTop: 3,
      }}>
      <IconButton onClick={() => setOpen(!open)}>
        <MenuIcon sx={{ color: "#0A84FF" }} />
      </IconButton>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              paddingLeft: 2,
            }}>
            <DashboardIcon sx={{ color: "#0A84FF" }} />
            {open && <Typography>Dashboard</Typography>}
          </Box>
        </Link>

        <Link to="/chat" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              paddingLeft: 2,
            }}>
            <ChatIcon sx={{ color: "#0A84FF" }} />
            {open && <Typography>Chatbot</Typography>}
          </Box>
        </Link>

        <Link to="/analytics" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              paddingLeft: 2,
            }}>
            <BarChartIcon sx={{ color: "#0A84FF" }} />
            {open && <Typography>Analytics</Typography>}
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
