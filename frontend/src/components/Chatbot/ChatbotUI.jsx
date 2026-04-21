import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { motion } from "framer-motion";
import { useThemeContext } from "../../hooks/useThemeContext";
import { api } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

// ================= TYPING =================
const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.6, p: 2 }}>
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
   // const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

   const { user } = useAuth();
   useEffect(() => {
     if (!user) return;

     const saved = localStorage.getItem(`health_ai_sessions_${user.uid}`);
     setSessions(saved ? JSON.parse(saved) : []);

     setMessages([]); // clear old chat
     setChatId(null); // reset chat
   }, [user]);
  // LOCAL STORAGE PERSISTENCE STATE
  const [sessions, setSessions] = useState(() => {
    if (!user) return [];
    const saved = localStorage.getItem(`health_ai_sessions_${user.uid}`);
    return saved ? JSON.parse(saved) : [];
  });

  const messagesEndRef = useRef(null);
  const { mode } = useThemeContext();
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // SYNC TO LOCAL STORAGE
  useEffect(() => {
     if (!chatId || messages.length === 0) return;
     if (!user) return;
    const newSessions = [...sessions];
    let idx = newSessions.findIndex(s => s.id === chatId);
    
    if (idx === -1) {
       // Create new tracking session
       newSessions.unshift({ 
         id: chatId, 
         title: messages[0]?.text || "New AI Session", 
         date: new Date().toISOString(), 
         messages: messages 
       });
    } else {
       // Update existing session
       newSessions[idx].messages = messages;
       newSessions[idx].date = new Date().toISOString(); // update timestamp
    }
    
    setSessions(newSessions);
    localStorage.setItem(
      `health_ai_sessions_${user.uid}`,
      JSON.stringify(newSessions),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, chatId]);

  const quickActions = [
    "What are the early signs of a migraine?",
    "Analyze my chest pain risk factors.",
    "Give me a summary of a healthy diet.",
    "How does the AI Engine determine risk?",
  ];

  // ================= SEND MESSAGE =================
  const sendMessage = async (overrideText = null) => {
    const userText = overrideText || input;
    if (!userText.trim()) return;
   
     const token = localStorage.getItem("token"); // ✅ ADD HERE
     if (!token) {
       console.error("❌ No token found. Please login again.");
       return;
     }

    if (!overrideText) setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setLoading(true);

    try {
      let currentChatId = chatId;
      if (!currentChatId) {
        // Fallback for visual mock if backend createChat fails
        let newId = `chat-${Date.now()}`;
        try {
           const chat = await api.createChat(token);
           newId = chat.id;
        } catch(err) {
           console.warn("Backend unavailable, using local memory ID");
        }
        currentChatId = newId;
        setChatId(newId);
      }

      const res = await api.sendMessage(currentChatId, userText, token);
      
      let topPrediction = res?.top_3_predictions?.[0] || null;
      let otherPredictions = res?.top_3_predictions?.slice(1) || null;

      const reply = topPrediction?.disease || res?.reply || "No assessment generated.";
      const confidence = Number(topPrediction?.confidence || res?.confidence || 0);
      const mappedOther = otherPredictions || res?.other_predictions || [];
      const mappedRecommendations = res?.precautions 
        ? res.precautions.split(';').map(s => s.trim()).filter(Boolean) 
        : (res?.recommendations || []);
      const riskLevel = res?.risk_level || (confidence >= 75 ? "high" : confidence >= 40 ? "medium" : "low");

      const safeData = {
        reply: reply,
        confidence: confidence,
        other_predictions: mappedOther,
        recommendations: mappedRecommendations,
        risk_level: riskLevel,
        emergency: res?.emergency || false,
        note: res?.note || "",
        disclaimer: res?.disclaimer || ""
      };

      setMessages((prev) => [...prev, { from: "ai", data: safeData }]);
      window.dispatchEvent(new Event("analyticsUpdated"));
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "ai", error: true, text: "AI Service Connection Timeout." }]);
    }

    setLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    setChatId(null);
  };

  const loadSession = (id) => {
    const s = sessions.find(x => x.id === id);
    if (s) {
       setChatId(s.id);
       setMessages(s.messages);
    }
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem(
      `health_ai_sessions_${user.uid}`,
      JSON.stringify(newSessions),
    );
    if (chatId === id) handleClearChat();
  };

  const formatTimeAgo = (isoString) => {
    const dates = new Date(isoString);
    const now = new Date();
    const diff = now - dates;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  }

  // ================= AI CARD RENDERING =================
  const renderAIResponse = (data) => {
    if (!data) return null;

    // SANITIZATION: Clean up ugly backend formatting duplications and Emojis
    let cleanReply = (data.reply || "")
       .replace(/📊?\s*Confidence:\s*\d+(\.\d+)?[%]?/gi, '')
       .replace(/🦠/g, '')
       .trim();

    // ERROR DEGRADED STATE
    if (cleanReply.toLowerCase().includes("temporarily unavailable") || data.confidence === 0) {
       return (
          <Box sx={{ background: mode==="light"?"rgba(255, 170, 0, 0.1)":"rgba(255, 170, 0, 0.05)", border: "1px solid rgba(255, 170, 0, 0.3)", borderRadius: "16px", borderTopLeftRadius: "0px", p: 2.5, maxWidth: "85%" }}>
             <Box sx={{ display:"flex", alignItems:"center", gap: 1, mb: 1, color:"#ff9800" }}>
                <WarningRoundedIcon fontSize="small" />
                <Typography fontWeight={800} fontSize="0.95rem">Service Degraded</Typography>
             </Box>
             <Typography sx={{ color: mode==="light"?"#555":"#ccc", fontSize: "0.95rem" }}>
               {cleanReply || "Our medical AI interference layer is momentarily experiencing high latency. Please retry."}
             </Typography>
          </Box>
       );
    }

    const safeRisk = (data.risk_level || "low").toLowerCase();

    return (
      <Box
        sx={{
          background: mode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(35, 38, 45, 0.95)",
          backdropFilter: "blur(20px)",
          border: mode === "light" ? "1px solid rgba(100, 150, 255, 0.1)" : "1px solid rgba(255,255,255,0.05)",
          borderRadius: "20px",
          borderTopLeftRadius: "0px",
          p: 3,
          maxWidth: "85%",
          minWidth: { xs: "100%", md: "400px" },
          boxShadow: mode === "light" ? "0 10px 40px rgba(102, 126, 234, 0.1)" : "0 10px 40px rgba(0, 0, 0, 0.4)",
        }}>
        
        {/* Header Map */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
           <Box>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#667eea", textTransform: "uppercase", letterSpacing: "1px", mb: 0.5 }}>
                 Primary Assessment
              </Typography>
              <Typography sx={{ fontWeight: 800, color: mode==="light"?"#1a1a1a":"#fff", fontSize: "1.4rem", lineHeight: 1.2, textTransform: "capitalize" }}>
                {cleanReply}
              </Typography>
           </Box>
           
           {/* Confidence Ring equivalent */}
           <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#00c49f", lineHeight: 1 }}>
                 {Number(data.confidence || 0).toFixed(1)}<Typography component="span" sx={{fontSize: "0.9rem", color: mode==="light"?"#888":"#888", fontWeight:600}}>%</Typography>
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: mode==="light"?"#888":"#777", textTransform:"uppercase", fontWeight:700 }}>Confidence</Typography>
           </Box>
        </Box>

        {/* Risk Level Notice */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, p: 1.5, borderRadius: "12px", background: safeRisk === "high" ? "rgba(255, 77, 79, 0.1)" : safeRisk === "medium" ? "rgba(255, 169, 64, 0.1)" : "rgba(0, 196, 159, 0.1)" }}>
           <WarningRoundedIcon sx={{ fontSize: "1.1rem", color: safeRisk === "high" ? "#ff4d4f" : safeRisk === "medium" ? "#ffa940" : "#00c49f" }} />
           <Typography fontSize={13} sx={{ color: mode==="light"?"#333":"#ddd", fontWeight: 600 }}>
             Assessed Risk Level: <Box component="span" sx={{ fontWeight: 800, color: safeRisk === "high" ? "#ff4d4f" : safeRisk === "medium" ? "#ffa940" : "#00c49f" }}>{(data.risk_level || "low").toUpperCase()}</Box>
           </Typography>
        </Box>

        {data.emergency && (
          <Box sx={{ background: "linear-gradient(135deg, #ff4d4f, #ff7875)", p: 2, borderRadius: "12px", mb: 2.5, boxShadow: "0 4px 15px rgba(255, 77, 79, 0.3)" }}>
             <Typography color="white" fontSize={14} fontWeight={800}>
               🚨 Emergency detected! Seek immediate medical assistance via 911.
             </Typography>
          </Box>
        )}

        {/* Other Predictions (Symptoms / Alternative Diagnoses) */}
        {data.other_predictions && data.other_predictions.length > 0 && (
           <Box sx={{ mb: 2.5 }}>
              <Typography fontSize={12} sx={{ color: mode==="light"?"#888":"#888", fontWeight: 700, textTransform: "uppercase", mb: 1, letterSpacing: "0.5px" }}>
                Differential Analysis
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                 {data.other_predictions.map((p, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                       <Typography fontSize={13} sx={{ color: mode==="light"?"#555":"#ccc", fontWeight: 500, width: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>
                          {(p.disease || "Unknown").replace(/_/g, " ")}
                       </Typography>
                       <Box sx={{ flexGrow: 1, mx: 2, height: 6, background: mode==="light"?"#eaeaea":"#2a2a35", borderRadius: 3, overflow: "hidden" }}>
                          <Box sx={{ width: `${Math.min(100, Number(p.confidence) || 0)}%`, height: "100%", background: mode==="light"?"#a3b1f0":"#4a5590", borderRadius: 3, transition: "width 1s ease" }} />
                       </Box>
                       <Typography fontSize={12} sx={{ fontWeight: 700, width: "40px", textAlign: "right", color: mode==="light"?"#666":"#888" }}>
                          {Number(p.confidence || 0).toFixed(1)}%
                       </Typography>
                    </Box>
                 ))}
              </Box>
           </Box>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <Box sx={{ borderTop: mode==="light"?"1px solid rgba(0,0,0,0.06)":"1px solid rgba(255,255,255,0.06)", pt: 2.5 }}>
            <Typography fontSize={12} sx={{ color: mode==="light"?"#888":"#888", fontWeight: 700, textTransform: "uppercase", mb: 1.5, letterSpacing: "0.5px" }}>
              Action Plan
            </Typography>
            {data.recommendations.map((rec, i) => {
              const searchStr = rec.toLowerCase();
              const isDoctorQuery = searchStr.includes("doctor") || searchStr.includes("physician") || searchStr.includes("consult") || searchStr.includes("hospital") || searchStr.includes("medical");
              return (
              <Box key={i} sx={{ display:"flex", alignItems:"flex-start", gap: 1.5, mb: 1 }}>
                 <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#667eea", mt: 0.2 }} />
                 {isDoctorQuery ? (
                    <Box 
                       component="a" 
                       href={`https://www.google.com/maps/search/${encodeURIComponent(cleanReply)}+specialist+doctor+near+me`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       sx={{ 
                          color: mode==="light" ? "#667eea" : "#a3b1f0", 
                          fontSize: 13,
                          lineHeight: 1.5, 
                          fontWeight: 700, 
                          textDecoration: "none", 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 0.8,
                          transition: "0.2s",
                          "&:hover": { color: mode==="light" ? "#4a5590" : "#d1d9ff" }
                       }}>
                       {rec}
                       <Box component="span" sx={{ fontSize: "0.75rem", background: mode==="light"?"rgba(102, 126, 234, 0.1)":"rgba(163, 177, 240, 0.1)", px: 0.8, py: 0.2, borderRadius: "4px", display: "flex", alignItems: "center" }}>
                          Find nearby 📍
                       </Box>
                    </Box>
                 ) : (
                    <Typography fontSize={13} sx={{ color: mode==="light"?"#444":"#ddd", lineHeight: 1.5, fontWeight: 500 }}>{rec}</Typography>
                 )}
              </Box>
            )})}
          </Box>
        )}

        {/* Notes and Disclaimers */}
        {data.note && (
          <Box sx={{ mt: 2.5, p: 1.5, borderRadius: "10px", background: mode==="light"?"rgba(102, 126, 234, 0.05)":"rgba(102, 126, 234, 0.05)", border: mode==="light"?"1px solid rgba(102, 126, 234, 0.1)":"1px solid rgba(102, 126, 234, 0.1)", display: "flex", alignItems: "flex-start", gap: 1 }}>
             <Typography fontSize={14}>ℹ️</Typography>
             <Typography fontSize={12} sx={{ color: mode==="light"?"#555":"#aaa", fontStyle: "italic", lineHeight: 1.5, mt: 0.2 }}>
               {data.note}
             </Typography>
          </Box>
        )}

        {data.disclaimer && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
             <Typography fontSize={11} sx={{ color: mode==="light"?"#999":"#666", fontWeight: 500, opacity: 0.8 }}>
               {data.disclaimer}
             </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", background: mode === "light" ? "#f8f9fa" : "#0f0f12" }}>
       
      {/* ================= LEFT SIDEBAR ================= */}
      <Box sx={{ 
         width: { xs: 0, md: "300px" }, 
         display: { xs: "none", md: "flex" }, 
         flexDirection: "column", 
         borderRight: mode==="light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.05)",
         background: mode==="light" ? "#ffffff" : "#141518",
         flexShrink: 0
      }}>
         {/* Sidebar Header */}
         <Box sx={{ p: 3, borderBottom: mode==="light"?"1px solid rgba(0,0,0,0.05)":"1px solid rgba(255,255,255,0.05)" }}>
            <Button 
               fullWidth
               onClick={handleClearChat}
               variant="outlined" 
               startIcon={<AddRoundedIcon />} 
               sx={{ 
                  textTransform: "none", 
                  fontWeight: 700, 
                  py: 1.2, 
                  borderRadius: "12px", 
                  borderColor: mode==="light"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)", 
                  color: mode==="light"?"#1a1a1a":"#fff",
                  "&:hover": { background: mode==="light"?"rgba(0,0,0,0.02)":"rgba(255,255,255,0.02)" }
               }}
            >
               New AI Session
            </Button>
         </Box>

         {/* Sidebar History List */}
         <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: mode==="light"?"#999":"#666", mb: 1, ml: 1, letterSpacing: "0.5px", textTransform: "uppercase" }}>Recent Sessions</Typography>
            
            {sessions.length === 0 && (
               <Typography sx={{ fontSize: "0.85rem", color: mode==="light"?"#888":"#555", px: 2, mt: 1, fontStyle: "italic" }}>No stored sessions.</Typography>
            )}

            {sessions.map((history) => (
               <Box 
                 key={history.id} 
                 onClick={() => loadSession(history.id)}
                 sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5, 
                    p: 1.5, 
                    borderRadius: "12px", 
                    cursor: "pointer", 
                    background: chatId === history.id ? (mode==="light"?"rgba(102, 126, 234, 0.1)":"rgba(102, 126, 234, 0.2)") : "transparent",
                    "&:hover": { background: chatId === history.id ? "" : (mode==="light"?"rgba(0,0,0,0.03)":"rgba(255,255,255,0.03)") },
                    transition: "0.2s",
                    position: "relative"
                 }}>
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: "1.1rem", color: chatId === history.id ? "#667eea" : (mode==="light"?"#888":"#777") }} />
                  <Box sx={{ flexGrow: 1 }}>
                     <Typography sx={{ fontSize: "0.9rem", fontWeight: chatId === history.id ? 700 : 600, color: mode==="light"?"#333":"#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "160px" }}>{history.title}</Typography>
                     <Typography sx={{ fontSize: "0.75rem", color: mode==="light"?"#999":"#666" }}>{formatTimeAgo(history.date)}</Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => deleteSession(history.id, e)} sx={{ opacity: 0.5, "&:hover":{opacity: 1, color: "red"} }}>
                     <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
               </Box>
            ))}
         </Box>

         {/* Sidebar Footer */}
         <Box sx={{ p: 3, borderTop: mode==="light"?"1px solid rgba(0,0,0,0.05)":"1px solid rgba(255,255,255,0.05)" }}>
            <Typography sx={{ fontSize: "0.8rem", color: mode==="light"?"#888":"#666", textAlign: "center" }}>AI behavior may occasionally hallucinate. Verify critical choices.</Typography>
         </Box>
      </Box>

      {/* ================= MAIN CHAT AREA ================= */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative" }}>
         
         {/* Live Header Status */}
         <Box sx={{ p: 2, px: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: mode==="light"?"1px solid rgba(0,0,0,0.05)":"1px solid rgba(255,255,255,0.05)", background: mode==="light"?"rgba(255,255,255,0.8)":"rgba(20,20,25,0.8)", backdropFilter: "blur(12px)", position:"sticky", top: 0, zIndex: 10 }}>
            <Box sx={{ display:"flex", alignItems:"center", gap: 1.5 }}>
               <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#00c49f", boxShadow: "0 0 10px #00c49f", animation: "pulse 2s infinite" }} />
               <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: mode==="light"?"#1a1a1a":"#fff" }}>Neural Engine Active</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
               <IconButton onClick={handleClearChat} sx={{ color: mode==="light"?"#666":"#aaa" }} title="Clear Chat"><DeleteOutlineRoundedIcon /></IconButton>
               <IconButton sx={{ color: mode==="light"?"#666":"#aaa" }} title="Export Thread"><DownloadRoundedIcon /></IconButton>
            </Box>
         </Box>

         <style>
         {`
           @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
         `}
         </style>

         {/* Dynamic Chat Rendering */}
         <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 5 }, display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* EMPTY STATE */}
            {messages.length === 0 && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ width: 70, height: 70, borderRadius: "20px", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", mb: 4, boxShadow: "0 15px 30px rgba(102, 126, 234, 0.3)" }}>
                     <Typography fontSize={32}>✨</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: mode==="light"?"#1a1a1a":"#fff", mb: 1, textAlign:"center" }}>
                     Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {user?.displayName || "User"}.
                  </Typography>
                  <Typography sx={{ color: mode==="light"?"#666":"#aaa", fontSize: "1.2rem", mb: 6, textAlign:"center" }}>
                     How can I assist with your health intelligence today?
                  </Typography>

                  {/* Quick Action Grid */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, width: "100%", maxWidth: "700px" }}>
                     {quickActions.map((action, idx) => (
                        <Box 
                           key={idx}
                           onClick={() => sendMessage(action)}
                           sx={{ 
                              p: 2.5, 
                              borderRadius: "16px", 
                              border: mode==="light"?"1px solid rgba(0,0,0,0.08)":"1px solid rgba(255,255,255,0.05)",
                              background: mode==="light"?"rgba(255,255,255,0.5)":"rgba(30,30,35,0.5)",
                              cursor: "pointer",
                              transition: "0.2s",
                              "&:hover": { transform: "translateY(-4px)", background: mode==="light"?"#fff":"#222", boxShadow: mode==="light"?"0 10px 20px rgba(0,0,0,0.05)":"0 10px 20px rgba(0,0,0,0.5)" }
                           }}>
                           <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: mode==="light"?"#333":"#eee" }}>{action}</Typography>
                        </Box>
                     ))}
                  </Box>
               </motion.div>
            )}

            {/* MESSAGE FEED */}
            {messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  width: "100%",
                }}>
                {m.from === "user" ? (
                  <Box sx={{ bgcolor: "#667eea", color: "white", px: 3, py: 1.5, borderRadius: "20px", borderBottomRightRadius: "0px", maxWidth: "75%", fontSize: "1.05rem", fontWeight: 500, boxShadow: "0 10px 20px rgba(102, 126, 234, 0.2)" }}>
                    {m.text}
                  </Box>
                ) : m.error ? (
                  <Box sx={{ color: "#ff9800", p: 2, background: "rgba(255, 152, 0, 0.1)", borderRadius: "16px", border: "1px solid rgba(255, 152, 0, 0.3)" }}>
                    <Box sx={{ display:"flex", alignItems:"center", gap: 1, mb: 1 }}>
                       <WarningRoundedIcon fontSize="small" />
                       <Typography fontWeight={800} fontSize="0.95rem">System Unavailable</Typography>
                    </Box>
                    <Typography fontSize="0.9rem">{m.text || "Cannot reach AI backend at this time."}</Typography>
                  </Box>
                ) : (
                  renderAIResponse(m.data)
                )}
              </motion.div>
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
         </Box>

         {/* ================= FLOATING INPUT PILL ================= */}
         <Box sx={{ p: { xs: 2, md: 4 }, pt: 0, display: "flex", justifyContent: "center" }}>
           <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              width: "100%", 
              maxWidth: "800px",
              background: mode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(35, 38, 45, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: '50px', 
              px: 2, 
              py: 1, 
              boxShadow: mode === "light" ? "0 10px 30px rgba(0,0,0,0.08)" : "0 10px 30px rgba(0,0,0,0.5)",
              border: mode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.1)" }}>
             
             <IconButton sx={{ color: mode === "light" ? "#666" : "#aaa", mr: 1 }}>
               <MicIcon />
             </IconButton>

             <TextField
               fullWidth
               variant="standard"
               InputProps={{ disableUnderline: true }}
               sx={{ flex: 1, "& input": { color: mode === "light" ? "#1a1a1a" : "#fff", padding: "12px 0", fontSize: "1.05rem" } }}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
               placeholder="Chat with your Health AI..."
               disabled={loading}
             />

             <IconButton onClick={() => sendMessage()} disabled={loading} sx={{ color: mode === "light" ? "#fff" : "#fff", background: "linear-gradient(135deg, #667eea, #764ba2)", p: 1.2, ml: 1, "&:hover":{ opacity: 0.9 } }}>
               <SendIcon sx={{ fontSize: "1.2rem" }} />
             </IconButton>
           </Box>
         </Box>

      </Box>
    </Box>
  );
}
