import { AppBar, Toolbar, Box, Typography, Avatar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Chat", path: "/chat" },
    { label: "Analytics", path: "/analytics" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.25)",
        px: 4,
      }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT — LOGO */}
        <Typography
          component={Link}
          to="/"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0A84FF",
            textDecoration: "none",
          }}>
          Public Health AI
        </Typography>

        {/* CENTER — NAVIGATION PILL */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            padding: "10px 25px",
            borderRadius: "40px",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(25px) saturate(180%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}>
          {navItems.map((item) => (
            <Typography
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "20px",
                textDecoration: "none",
                color:
                  location.pathname === item.path ? "#fff" : "rgba(0,0,0,0.7)",
                background:
                  location.pathname === item.path
                    ? "linear-gradient(135deg,#0A84FF,#4AB1FF)"
                    : "transparent",
                transition: "0.25s ease",
                "&:hover": {
                  background:
                    location.pathname === item.path
                      ? "linear-gradient(135deg,#006BE6,#0A84FF)"
                      : "rgba(0,0,0,0.06)",
                },
              }}>
              {item.label}
            </Typography>
          ))}
        </Box>

        {/* RIGHT — AVATAR */}
        <Avatar
          component={Link}
          to="/profile"
          src="https://img.icons8.com/color/96/user-male-circle--v1.png"
          sx={{
            width: 42,
            height: 42,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
