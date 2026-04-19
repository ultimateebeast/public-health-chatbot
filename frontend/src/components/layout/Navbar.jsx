import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context";
import {
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { mode, toggleTheme } = useThemeContext();
  const { user } = useAuth();

  const ADMIN_EMAIL = "pratyushjain1000@gmail.com";
  const isAdmin = user?.email === ADMIN_EMAIL;

  // 🔥 NAV ITEMS (DYNAMIC)
  const baseNavItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    {
      name: "Dashboard & Analytics",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    { name: "Chat", path: "/chat", icon: <ChatIcon /> },
  ];

  const adminItem = {
    name: "Admin Panel",
    path: "/admin",
    icon: <AdminPanelSettingsIcon />,
    isAdmin: true,
  };

  const profileItem = {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon />,
  };

  const navItems = isAdmin
    ? [...baseNavItems, adminItem, profileItem]
    : [...baseNavItems, profileItem];

  const isActive = (path) => location.pathname === path;

  const primaryGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        width: "100%",
        backdropFilter: "blur(15px)",
        background:
          mode === "light"
            ? "rgba(255, 255, 255, 0.96)"
            : "rgba(20, 20, 20, 0.96)",
        borderBottom:
          mode === "light"
            ? "1px solid rgba(102, 126, 234, 0.1)"
            : "1px solid rgba(102, 126, 234, 0.2)",
        padding: { xs: "16px 20px", md: "16px 40px" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}>
      {/* LOGO */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.3rem",
            background: primaryGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
          }}>
          💊 Health AI
        </Box>
      </motion.div>

      {/* DESKTOP NAV */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 1.5,
          background:
            mode === "light"
              ? "rgba(102, 126, 234, 0.08)"
              : "rgba(102, 126, 234, 0.12)",
          padding: "10px 18px",
          borderRadius: "16px",
        }}>
        {navItems.map((item) => (
          <motion.div key={item.path}>
            <Button
              component={Link}
              to={item.path}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                gap: 0.8,
                fontWeight: 600,
                background: isActive(item.path)
                  ? primaryGradient
                  : "transparent",
                color: isActive(item.path)
                  ? "white"
                  : item.isAdmin
                    ? "#a78bfa"
                    : mode === "light"
                      ? "#1a1a1a"
                      : "#f0f0f0",
                display: "flex",
                alignItems: "center",
              }}>
              {item.icon}
              {item.name}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={toggleTheme}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
            }}>
            <strong>Menu</strong>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setOpen(false)}>
                <ListItemIcon
                  sx={{ color: item.isAdmin ? "#a78bfa" : "#667eea" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
