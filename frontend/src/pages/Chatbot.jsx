import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your Public Health Assistant.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // SEND MESSAGE FUNCTION
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

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ AI error. Please try again." },
        ]);
      }
    } catch (err) {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Server error. Please check backend." },
      ]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 4,
        background: "linear-gradient(135deg, #0A84FF, #23D5AB)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      {/* MAIN CHAT CARD */}
      <Box
        sx={{
          width: "90%",
          maxWidth: "700px",
          height: "80vh",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(15px)",
          borderRadius: "25px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}>
        {/* HEADER */}
        <Box
          sx={{
            padding: 2,
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <motion.img
            src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
            width={55}
            height={55}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ borderRadius: "50%" }}
          />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Public Health Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}>
              <Box
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  padding: 2,
                  borderRadius: "15px",
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #0A84FF, #4AB1FF)"
                      : "rgba(255,255,255,0.8)",
                  color: msg.sender === "user" ? "#fff" : "#000",
                }}>
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        style={{ fontSize: "22px", marginBottom: "10px" }}
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        style={{ fontSize: "20px", marginBottom: "8px" }}
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        style={{ fontSize: "18px", marginBottom: "6px" }}
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <p
                        style={{ marginBottom: "8px", lineHeight: 1.5 }}
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li style={{ marginBottom: "4px" }} {...props} />
                    ),
                  }}>
                  {msg.text}
                </ReactMarkdown>
              </Box>
            </motion.div>
          ))}

          {/* TYPING INDICATOR */}
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.4)",
                  borderRadius: "15px",
                  padding: "10px 20px",
                  width: "100px",
                }}>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}>
                  typing…
                </motion.span>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT SECTION */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingTop: 2,
            borderTop: "1px solid rgba(255,255,255,0.3)",
          }}>
          {/* MIC */}
          <IconButton
            sx={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)",
            }}>
            <MicIcon />
          </IconButton>

          {/* INPUT */}
          <TextField
            fullWidth
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: "10px",
            }}
          />

          {/* SEND */}
          <IconButton
            onClick={sendMessage}
            sx={{
              background: "#0A84FF",
              "&:hover": { background: "#006BE6" },
            }}>
            <SendIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
