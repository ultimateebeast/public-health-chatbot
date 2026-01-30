import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg,#0A84FF,#2EE59D)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "55%",
          height: "85%",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <motion.img
            src="https://img.icons8.com/fluency/96/artificial-intelligence.png"
            width={65}
            height={65}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              borderRadius: "50%",
              marginRight: "12px",
              border: "3px solid #fff",
            }}
          />

          <Box sx={{ color: "#fff" }}>
            <h2 style={{ margin: 0 }}>Public Health Assistant</h2>
            <p style={{ opacity: 0.8, marginTop: 4 }}>Powered by AI (Gemini)</p>
          </Box>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 1,
            display: "flex",
            flexDirection: "column",
          }}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  maxWidth: "65%",
                  borderRadius: "14px",
                  background:
                    m.from === "user" ? "#fff" : "rgba(255,255,255,0.6)",
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
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
                  p: 1.5,
                  mb: 2,
                  maxWidth: "65%",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.6)",
                  color: "#000",
                  alignSelf: "flex-start",
                }}>
                typing…
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT SECTION */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {/* Mic Button */}
          <IconButton sx={{ background: "#fff" }}>
            <MicIcon />
          </IconButton>

          {/* Input */}
          <TextField
            fullWidth
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              background: "#fff",
              borderRadius: "12px",
            }}
          />

          {/* Send Button */}
          <IconButton sx={{ background: "#fff" }} onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
