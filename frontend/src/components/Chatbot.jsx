import React, { useState } from "react";
import { Box, TextField, IconButton, Avatar, Chip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg,#2D6CDF,#06C270)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "55%",
          height: "85%",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(20px)",
          borderRadius: "25px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingBottom: 2,
            borderBottom: "1px solid rgba(255,255,255,0.4)",
          }}>
          <Avatar
            src="/doctor_bot.png"
            sx={{
              width: 55,
              height: 55,
              border: "3px solid #06C270",
              boxShadow: "0 0 12px #06c270",
            }}
          />
          <Box sx={{ color: "#fff" }}>
            <h2 style={{ margin: 0 }}>Public Health AI Assistant</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>Verified by WHO/CDC</p>
          </Box>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 2,
            marginTop: 1,
          }}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}>
              <Box
                sx={{
                  background:
                    msg.sender === "user" ? "#2D6CDF" : "rgba(255,255,255,0.8)",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  padding: "12px 16px",
                  maxWidth: "65%",
                  borderRadius: "18px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                }}>
                {msg.text}
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* INPUT AREA */}
        <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
          <IconButton sx={{ bgcolor: "#fff" }}>
            <MicIcon />
          </IconButton>

          <TextField
            placeholder="Ask your health question…"
            fullWidth
            sx={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "12px",
            }}
          />

          <IconButton sx={{ bgcolor: "#fff" }}>
            <SendIcon />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
