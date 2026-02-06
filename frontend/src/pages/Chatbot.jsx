import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../context/ThemeContext";

export default function ChatbotPage() {
  const { mode } = useTheme();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 **Welcome!** I'm your **Public Health Assistant**.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const bubbleRefs = useRef([]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });

    const lastBubble = bubbleRefs.current[bubbleRefs.current.length - 1];
    if (lastBubble) {
      gsap.from(lastBubble, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const msg = input;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "⚠️ Please try again." },
      ]);
    } catch {
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
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #dce6f7, #eef4ff)"
            : "linear-gradient(135deg, #0d0d0d, #1a1a1a)",
        display: "flex",
        justifyContent: "center",
        paddingTop: { xs: "70px", md: "100px" },
      }}>
      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "95%",
          maxWidth: "750px",
          height: "80vh",
          borderRadius: "25px",
          display: "flex",
          flexDirection: "column",
          background:
            mode === "light" ? "rgba(255,255,255,0.6)" : "rgba(40,40,40,0.5)",
          backdropFilter: "blur(20px)",
          border:
            mode === "light"
              ? "1px solid rgba(255,255,255,0.5)"
              : "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            mode === "light"
              ? "0 10px 40px rgba(0,0,0,0.15)"
              : "0 10px 40px rgba(0,0,0,0.65)",
        }}>
        {/* Header */}
        <Box
          sx={{
            padding: 2,
            borderBottom:
              mode === "light"
                ? "1px solid rgba(255,255,255,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <motion.img
            src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
            width={48}
            height={48}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: mode === "light" ? "#111" : "#eee",
              }}>
              Public Health Assistant
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", opacity: 0.65 }}>
              Powered by Gemini AI
            </Typography>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box
          ref={chatRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              ref={(el) => (bubbleRefs.current[i] = el)}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}>
              <Box
                sx={{
                  maxWidth: "75%",
                  padding: "12px 18px",
                  borderRadius: "20px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg,#007AFF,#0AA2FF)"
                      : mode === "light"
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(60,60,60,0.8)",
                  color:
                    msg.sender === "user"
                      ? "#fff"
                      : mode === "light"
                        ? "#000"
                        : "#eee",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 6px 18px rgba(0,122,255,0.4)"
                      : "0 6px 18px rgba(0,0,0,0.2)",
                }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </Box>
            </div>
          ))}

          {typing && (
            <Typography
              sx={{
                opacity: 0.7,
                fontSize: "0.9rem",
                marginLeft: "10px",
              }}>
              typing...
            </Typography>
          )}
        </Box>

        {/* Fixed Input Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            padding: 2,
            borderTop:
              mode === "light"
                ? "1px solid rgba(255,255,255,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
          }}>
          <IconButton
            sx={{
              background:
                mode === "light"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(60,60,60,0.8)",
              width: 45,
              height: 45,
            }}>
            <MicIcon />
          </IconButton>

          <TextField
            fullWidth
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              background:
                mode === "light"
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(70,70,70,0.8)",
              borderRadius: "14px",
              "& fieldset": { border: "none" },
            }}
          />

          <IconButton
            onClick={sendMessage}
            sx={{
              background: "#007AFF",
              width: 45,
              height: 45,
              "&:hover": { background: "#0061D4" },
            }}>
            <SendIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
