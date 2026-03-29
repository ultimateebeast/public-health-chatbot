import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";
import { api } from "../../api/api"; // ✅ IMPORTANT

// Typing animation
const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.6, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#666",
          }}
        />
      </motion.div>
    ))}
  </Box>
);

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

  const messagesEndRef = useRef(null);
  const { mode } = useThemeContext();

  const token = localStorage.getItem("token"); // ⚠️ Ensure token exists

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ FINAL SEND MESSAGE FUNCTION
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      let currentChatId = chatId;

      // 🟢 Step 1: Create chat if not exists
      if (!currentChatId) {
        const chat = await api.createChat(token);
        currentChatId = chat.id;
        setChatId(chat.id);
      }

      // 🟢 Step 2: Send message
      const res = await api.sendMessage(currentChatId, userText, token);

      // 🟢 Step 3: Add AI response
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: res.reply || "⚠️ No response from AI" },
      ]);
    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "❌ Error: Could not get a response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box
          sx={{
            width: "90vw",
            maxWidth: 600,
            height: "85vh",
            borderRadius: "20px",
            background: mode === "light" ? "#fff" : "#1e1e1e",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
          {/* HEADER */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "20px",
              display: "flex",
              gap: 2,
            }}>
            <SmartToyIcon />
            <Box>
              <Typography fontWeight={700}>Health Assistant</Typography>
              <Typography fontSize={12}>Always here to help</Typography>
            </Box>
          </Box>

          {/* MESSAGES */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background:
                      m.from === "user"
                        ? "#667eea"
                        : mode === "light"
                          ? "#eee"
                          : "#444",
                    color: m.from === "user" ? "white" : "inherit",
                  }}>
                  {m.text}
                </Box>
              </Box>
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT */}
          <Box sx={{ p: 2, display: "flex", gap: 1 }}>
            <IconButton>
              <MicIcon />
            </IconButton>

            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask about your health..."
            />

            <IconButton onClick={sendMessage} disabled={loading}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
