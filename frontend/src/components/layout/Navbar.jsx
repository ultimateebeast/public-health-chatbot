import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Box,
  Avatar,
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
import AnalyticsIcon from "@mui/icons-material/QueryStats";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { mode, toggleTheme } = useThemeContext();

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Chat", path: "/chat", icon: <ChatIcon /> },
    { name: "Analytics", path: "/analytics", icon: <AnalyticsIcon /> },
    { name: "Profile", path: "/profile", icon: <PersonIcon /> },
  ];

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
      {/* LOGO WITH ICON */}
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
            backgroundClip: "text",
            fontFamily: "'Poppins', sans-serif",
            color: "#667eea",
            cursor: "pointer",
          }}>
          💊 Health AI
        </Box>
      </motion.div>

      {/* DESKTOP NAVIGATION */}
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
          border: `1px solid rgba(102, 126, 234, ${mode === "light" ? "0.2" : "0.3"})`,
        }}>
        {navItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            <Button
              component={Link}
              to={item.path}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                gap: 0.8,
                fontWeight: 600,
                fontSize: "0.95rem",
                fontFamily: "'Inter', sans-serif",
                background: isActive(item.path)
                  ? primaryGradient
                  : "transparent",
                color: isActive(item.path)
                  ? "white"
                  : mode === "light"
                    ? "#1a1a1a"
                    : "#f0f0f0",
                boxShadow: isActive(item.path)
                  ? "0 4px 12px rgba(102, 126, 234, 0.4)"
                  : "none",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
              }}>
              {item.icon}
              <Box sx={{ display: { xs: "none", lg: "inline" } }}>
                {item.name}
              </Box>
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* RIGHT CONTROLS */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* DARK MODE BUTTON */}
        <motion.div whileHover={{ rotate: 20 }} whileTap={{ rotate: -20 }}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              background:
                mode === "light"
                  ? "rgba(102, 126, 234, 0.1)"
                  : "rgba(102, 126, 234, 0.2)",
              color: "#667eea",
              borderRadius: "10px",
              padding: "10px",
              transition: "all 0.3s ease",
              "&:hover": {
                background:
                  mode === "light"
                    ? "rgba(102, 126, 234, 0.15)"
                    : "rgba(102, 126, 234, 0.25)",
              },
            }}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </motion.div>

        {/* PROFILE AVATAR (DESKTOP) */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Box
            component={Link}
            to="/profile"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "10px",
              background: primaryGradient,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              },
            }}>
            👤
          </Box>
        </motion.div>

        {/* MOBILE MENU BUTTON */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setOpen(true)}>
          <MenuIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "280px",
            backdropFilter: "blur(15px)",
            background:
              mode === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(25, 25, 25, 0.95)",
          },
        }}>
        {/* Header with Close */}
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid rgba(102, 126, 234, ${mode === "light" ? "0.1" : "0.2"})`,
          }}>
          <Box sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#667eea" }}>
            Menu
          </Box>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ padding: "12px" }}>
          {navItems.map((item) => (
            <motion.div key={item.path} whileTap={{ scale: 0.95 }}>
              <ListItemButton
                onClick={() => setOpen(false)}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: "12px",
                  margin: "8px 0",
                  background: isActive(item.path)
                    ? primaryGradient
                    : mode === "light"
                      ? "rgba(102, 126, 234, 0.05)"
                      : "rgba(102, 126, 234, 0.1)",
                  color: isActive(item.path)
                    ? "white"
                    : mode === "light"
                      ? "#1a1a1a"
                      : "#f0f0f0",
                  fontWeight: isActive(item.path) ? 600 : 500,
                  transition: "all 0.3s ease",
                }}>
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? "white" : "#667eea",
                    minWidth: "40px",
                  }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                />
              </ListItemButton>
            </motion.div>
          ))}

          {/* Theme Toggle in Mobile */}
          <Box
            sx={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: `1px solid rgba(102, 126, 234, ${mode === "light" ? "0.1" : "0.2"})`,
            }}>
            <ListItemButton
              onClick={toggleTheme}
              sx={{
                borderRadius: "12px",
                background:
                  mode === "light"
                    ? "rgba(102, 126, 234, 0.05)"
                    : "rgba(102, 126, 234, 0.1)",
              }}>
              <ListItemIcon sx={{ color: "#667eea", minWidth: "40px" }}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </ListItemIcon>
              <ListItemText
                primary={mode === "light" ? "Dark Mode" : "Light Mode"}
                sx={{ fontFamily: "'Inter', sans-serif" }}
              />
            </ListItemButton>
          </Box>
        </List>
      </Drawer>
    </Box>
  );
}
