import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 **Welcome!**\nI'm your **Public Health Assistant**.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef([]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Animate new messages
    if (messageRefs.current.length > 0) {
      const last = messageRefs.current[messageRefs.current.length - 1];
      if (last) {
        gsap.from(last, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    }
  }, [messages, typing]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = input;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "⚠️ Sorry, I couldn't understand.",
        },
      ]);
    } catch (error) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Server error. Try again later." },
      ]);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0A84FF,#23D5AB)",
        padding: { xs: 1, md: 3 },
      }}>
      {/* MAIN CHAT GLASS CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.20)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
        {/* HEADER */}
        <Box
          sx={{
            padding: { xs: "10px 14px", md: "14px 22px" },
            borderBottom: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <motion.img
            src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
            width={50}
            height={50}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", md: "1.2rem" },
              }}>
              Public Health Assistant
            </Typography>
            <Typography sx={{ opacity: 0.7, fontSize: "0.8rem" }}>
              Powered by PHA
            </Typography>
          </Box>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: { xs: 1.5, md: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: 0, // SUPER IMPORTANT!
          }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              ref={(el) => (messageRefs.current[i] = el)}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}>
              <Box
                sx={{
                  maxWidth: { xs: "85%", md: "70%" },
                  padding: "12px 18px",
                  borderRadius: "18px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg,#0078FF,#0AA2FF)"
                      : "rgba(255,255,255,0.85)",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 6px 18px rgba(0,123,255,0.35)"
                      : "0 6px 18px rgba(0,0,0,0.10)",
                  wordBreak: "break-word",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </Box>
            </div>
          ))}

          {typing && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity }}>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  width: "80px",
                }}>
                typing...
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT AREA — FIXED AT BOTTOM */}
        <Box
          sx={{
            padding: { xs: "10px", md: "14px" },
            borderTop: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}>
          <IconButton
            sx={{
              background: "rgba(255,255,255,0.55)",
              width: { xs: 40, md: 45 },
              height: { xs: 40, md: 45 },
            }}>
            <MicIcon />
          </IconButton>

          <TextField
            fullWidth
            placeholder="Ask your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: "14px",
              "& fieldset": { border: "none" },
            }}
          />

          <IconButton
            onClick={sendMessage}
            sx={{
              background: "#0078FF",
              width: { xs: 40, md: 45 },
              height: { xs: 40, md: 45 },
            }}>
            <SendIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
