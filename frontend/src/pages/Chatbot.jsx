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

  // Auto scroll + GSAP animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const last = messageRefs.current[messageRefs.current.length - 1];
    if (last) {
      gsap.from(last, {
        y: 25,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    }
  }, [messages, typing]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const userText = input;
    setInput("");

    setTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "⚠️ Sorry, I couldn't understand. Try again!",
        },
      ]);
    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Server error. Please try again later.",
        },
      ]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A84FF, #23D5AB)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}>
      {/* Vision-OS Floating Glass Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          width: "90%",
          maxWidth: "780px",
          height: "85vh",
          borderRadius: "28px",
          padding: "20px",
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(25px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* HEADER */}
        <Box
          sx={{
            padding: 1,
            borderBottom: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <motion.img
            src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
            width={48}
            height={48}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            style={{ borderRadius: "50%" }}
          />

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
              Public Health Assistant
            </Typography>
            <Typography sx={{ opacity: 0.65, fontSize: "0.85rem" }}>
              Powered by PHA
            </Typography>
          </Box>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={(el) => (messageRefs.current[index] = el)}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}>
              <Box
                sx={{
                  maxWidth: "75%",
                  padding: "14px 18px",
                  borderRadius: "18px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #0078FF, #0AA2FF)"
                      : "rgba(255,255,255,0.85)",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  boxShadow:
                    msg.sender === "user"
                      ? "0 6px 18px rgba(0,123,255,0.35)"
                      : "0 6px 18px rgba(0,0,0,0.10)",
                  fontSize: "0.95rem",
                }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </Box>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ alignSelf: "flex-start" }}>
              <Box
                sx={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(10px)",
                  width: "85px",
                }}>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1 }}>
                  typing…
                </motion.span>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT BAR */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderTop: "1px solid rgba(255,255,255,0.4)",
          }}>
          {/* MIC */}
          <IconButton
            sx={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              width: 45,
              height: 45,
            }}>
            <MicIcon />
          </IconButton>

          {/* TEXT INPUT */}
          <TextField
            fullWidth
            placeholder="Ask your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: "12px",
              "& fieldset": { border: "none" },
            }}
          />

          {/* SEND */}
          <IconButton
            onClick={sendMessage}
            sx={{
              background: "#0078FF",
              width: 45,
              height: 45,
              "&:hover": { background: "#0060D1" },
            }}>
            <SendIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
