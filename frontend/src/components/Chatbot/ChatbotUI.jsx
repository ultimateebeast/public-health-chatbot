import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";

// Typing indicator animation
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
  const messagesEndRef = useRef(null);
  const { mode } = useThemeContext();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // STREAMING SEND MESSAGE FUNCTION
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // Add user's message
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");

    // Show typing bubble
    setLoading(true);

    // Add placeholder for AI message
    setMessages((prev) => [...prev, { from: "ai", text: "" }]);

    let fullResponse = "";

    try {
      const eventSource = new EventSource(
        `http://127.0.0.1:8000/api/chat-stream?message=${encodeURIComponent(
          userText,
        )}`,
      );

      eventSource.onmessage = (event) => {
        if (event.data === "[END]") {
          setLoading(false);
          eventSource.close();
          return;
        }

        fullResponse += event.data;

        // Update the last AI message dynamically
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullResponse;
          return updated;
        });
      };

      eventSource.onerror = () => {
        console.error("Streaming error");
        eventSource.close();

        setMessages((prev) => [
          ...prev,
          { from: "ai", text: "❌ Error: Could not get a response." },
        ]);
        setLoading(false);
      };
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}>
        <Box
          sx={{
            width: "90vw",
            maxWidth: 600,
            height: "85vh",
            borderRadius: "20px",
            background: mode === "light" ? "#fff" : "#1e1e1e",
            boxShadow:
              mode === "light"
                ? "0 25px 50px rgba(0, 0, 0, 0.15)"
                : "0 25px 50px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
          {/* HEADER */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <SmartToyIcon sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                Health Assistant
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
                Always here to help
              </Typography>
            </Box>
          </Box>

          {/* MESSAGES AREA */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#ccc",
                borderRadius: "10px",
                "&:hover": {
                  background: "#999",
                },
              },
            }}>
            {messages.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}>
                <Box sx={{ textAlign: "center" }}>
                  <SmartToyIcon
                    sx={{
                      fontSize: 80,
                      color: mode === "light" ? "#e0e0e0" : "#555",
                      mb: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      color: mode === "light" ? "#999" : "#888",
                      fontSize: 16,
                    }}>
                    Start a conversation about your health
                  </Typography>
                </Box>
              </Box>
            )}

            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                }}>
                <Box
                  sx={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius:
                      m.from === "user"
                        ? "18px 4px 18px 18px"
                        : "4px 18px 18px 18px",
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : mode === "light"
                          ? "#e5e5ea"
                          : "#3a3a3a",
                    color:
                      m.from === "user"
                        ? "white"
                        : mode === "light"
                          ? "#000"
                          : "#f0f0f0",
                    wordWrap: "break-word",
                    fontSize: 15,
                    lineHeight: 1.4,
                    boxShadow:
                      m.from === "user"
                        ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                        : "0 1px 4px rgba(0, 0, 0, 0.2)",
                  }}>
                  {m.text}
                </Box>
              </motion.div>
            ))}

            {/* AI TYPING INDICATOR */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box
                  sx={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: "4px 18px 18px 18px",
                    background: mode === "light" ? "#e5e5ea" : "#3a3a3a",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <TypingIndicator />
                </Box>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT SECTION */}
          <Box
            sx={{
              padding: "16px",
              borderTop:
                mode === "light" ? "1px solid #e0e0e0" : "1px solid #3a3a3a",
              background: mode === "light" ? "#fff" : "#1e1e1e",
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
            }}>
            <IconButton
              size="small"
              sx={{
                color: "#667eea",
                "&:hover": { background: "rgba(102, 126, 234, 0.1)" },
              }}>
              <MicIcon />
            </IconButton>

            <TextField
              fullWidth
              placeholder="Ask about your health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              multiline
              maxRows={3}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  fontSize: 15,
                  color: mode === "light" ? "#000" : "#f0f0f0",
                  "& fieldset": {
                    borderColor: mode === "light" ? "#e0e0e0" : "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                    borderWidth: 1.5,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px 16px",
                  color: mode === "light" ? "#000" : "#f0f0f0",
                },
              }}
            />

            <IconButton
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{
                background:
                  loading || !input.trim()
                    ? "#ccc"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  background:
                    loading || !input.trim()
                      ? "#ccc"
                      : "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                },
              }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
