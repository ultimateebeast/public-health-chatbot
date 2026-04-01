import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";
import { api } from "../../api/api";

// ================= TYPING =================
const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.6 }}>
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
            backgroundColor: "#888",
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      let currentChatId = chatId;

      // CREATE CHAT
      if (!currentChatId) {
        const chat = await api.createChat();
        currentChatId = chat.id;
        setChatId(chat.id);
      }

      // SEND MESSAGE
      const res = await api.sendMessage(currentChatId, userText);

      // ✅ SAFE RESPONSE STRUCTURE
      const safeData = {
        reply: res?.reply || "No response",
        confidence: Number(res?.confidence || 0),
        other_predictions: res?.other_predictions || [],
        recommendations: res?.recommendations || [],
        risk_level: res?.risk_level || "low",
        emergency: res?.emergency || false,
      };

      setMessages((prev) => [...prev, { from: "ai", data: safeData }]);

      // 🔥🔥🔥 LIVE ANALYTICS TRIGGER (IMPORTANT)
      window.dispatchEvent(new Event("analyticsUpdated"));
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "ai", error: true }]);
    }

    setLoading(false);
  };

  // ================= AI CARD =================
  const renderAIResponse = (data) => {
    if (!data) return null;

    return (
      <Box
        sx={{
          background: mode === "light" ? "#f4f6ff" : "#2a2a2a",
          borderRadius: 3,
          p: 2,
          maxWidth: "85%",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}>
        <Typography fontWeight={700} color="primary">
          🦠 {data.reply}
        </Typography>

        <Typography mt={1} fontSize={13}>
          ⚠️ Risk: <b>{data.risk_level}</b>
        </Typography>

        {data.emergency && (
          <Typography color="red" fontSize={13}>
            🚨 Emergency detected! Seek medical help.
          </Typography>
        )}

        <Typography fontSize={13} mt={1}>
          📊 Confidence: {data.confidence.toFixed(2)}%
        </Typography>

        <Box sx={{ height: 6, background: "#ddd", borderRadius: 5, mt: 1 }}>
          <Box
            sx={{
              width: `${data.confidence}%`,
              height: "100%",
              background: "#667eea",
              borderRadius: 5,
            }}
          />
        </Box>

        {data.other_predictions.length > 0 && (
          <Box mt={2}>
            <Typography fontSize={12} color="text.secondary">
              🔍 Other possibilities:
            </Typography>

            {data.other_predictions.map((p, i) => (
              <Typography key={i} fontSize={13}>
                • {p.disease} ({p.confidence}%)
              </Typography>
            ))}
          </Box>
        )}

        {data.recommendations.length > 0 && (
          <Box mt={2}>
            {data.recommendations.map((rec, i) => (
              <Typography key={i} fontSize={13} color="green">
                💡 {rec}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}>
      <Box
        sx={{
          width: "90vw",
          maxWidth: 600,
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          background: mode === "light" ? "#fff" : "#1e1e1e",
        }}>
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            bgcolor: "#667eea",
            color: "white",
          }}>
          <SmartToyIcon />
          <Typography fontWeight={700}>Health Assistant</Typography>
        </Box>

        {/* CHAT */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {messages.map((m, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}>
              {m.from === "user" ? (
                <Box
                  sx={{
                    bgcolor: "#667eea",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}>
                  {m.text}
                </Box>
              ) : m.error ? (
                <Box sx={{ color: "red" }}>❌ Error fetching response</Box>
              ) : (
                renderAIResponse(m.data)
              )}
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your health..."
          />

          <IconButton onClick={sendMessage} disabled={loading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
