import { useState } from "react";
import { Box, Typography, Button, LinearProgress, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useThemeContext";
import { auth } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const { user, logout } = useAuth();
  const { mode } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "User");

  // Tab configurations
  const tabs = ["General", "Usage Limits", "Security"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
        padding: { xs: 2, md: 6 },
        display: "flex",
        justifyContent: "center",
      }}>
      
      <Box sx={{ width: "100%", maxWidth: "1000px", mt: { xs: 2, md: 4 } }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 6, display: "flex", alignItems: "center", gap: 3 }}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
              }}>
              <Typography sx={{ fontSize: 40, color: "white" }}>👤</Typography>
            </Box>
          </motion.div>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: mode === "light" ? "#1a1a1a" : "#fff", mb: 0.5 }}>
              Account Portal
            </Typography>
            <Typography sx={{ color: mode === "light" ? "#666" : "#aaa", fontSize: "1.1rem" }}>
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || "User"}. Manage your AI subscription.
            </Typography>
          </Box>
        </Box>

        {/* DASHBOARD LAYOUT GRID */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 } }}>
          
          {/* SIDEBAR TABS */}
          <Box sx={{ width: { xs: "100%", md: "250px" }, flexShrink: 0 }}>
             <Box sx={{ display:"flex", flexDirection: { xs:"row", md:"column" }, gap: 1, overflowX:"auto" }}>
                {tabs.map((tab, idx) => (
                   <Button
                     key={tab}
                     onClick={() => setActiveTab(idx)}
                     sx={{
                        justifyContent: "flex-start",
                        px: 3, 
                        py: 2,
                        borderRadius: "14px",
                        textTransform: "none",
                        fontWeight: activeTab === idx ? 700 : 500,
                        fontSize: "1.05rem",
                        color: activeTab === idx ? (mode === "light" ? "#fff" : "#fff") : (mode === "light" ? "#666" : "#aaa"),
                        background: activeTab === idx 
                           ? "linear-gradient(135deg, #667eea, #764ba2)" 
                           : "transparent",
                        border: activeTab === idx ? "none" : `1px solid ${mode === "light" ? "transparent" : "transparent"}`,
                        whiteSpace: "nowrap",
                        "&:hover": {
                           background: activeTab === idx ? "linear-gradient(135deg, #667eea, #764ba2)" : (mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)")
                        }
                     }}
                   >
                      {tab}
                   </Button>
                ))}
             </Box>
          </Box>

          {/* TAB CONTENT AREA */}
          <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
               {/* GENERAL TAB */}
               {activeTab === 0 && (
                  <Box sx={{ background: mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(35,35,35,0.6)", backdropFilter:"blur(12px)", p: 4, borderRadius: "24px", border: `1px solid ${mode==="light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)"}`, boxShadow: mode==="light"?"0 10px 40px rgba(0,0,0,0.04)":"none" }}>
                     <Typography variant="h5" sx={{ fontWeight: 800, color: mode==="light" ? "#1a1a1a" : "#fff", mb: 3 }}>General Profile</Typography>
                     
                     <Box sx={{ display:"flex", flexDirection:"column", gap: 3 }}>
                        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${mode==="light"?"#eee":"#333"}`, pb: 2 }}>
                           <Typography sx={{ color: mode==="light"?"#666":"#aaa", fontWeight: 600 }}>Display Name</Typography>
                           {isEditing ? (
                             <TextField 
                               size="small" 
                               value={editName} 
                               onChange={(e) => setEditName(e.target.value)} 
                               sx={{ input: { color: mode==="light"?"#1a1a1a":"#fff" } }} 
                             />
                           ) : (
                             <Typography sx={{ color: mode==="light"?"#1a1a1a":"#fff", fontWeight: 500 }}>
                               {editName}
                             </Typography>
                           )}
                        </Box>
                        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${mode==="light"?"#eee":"#333"}`, pb: 2 }}>
                           <Typography sx={{ color: mode==="light"?"#666":"#aaa", fontWeight: 600 }}>Email Address</Typography>
                           <Typography sx={{ color: mode==="light"?"#1a1a1a":"#fff", fontWeight: 500 }}>{user?.email || "email@example.com"}</Typography>
                        </Box>
                        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${mode==="light"?"#eee":"#333"}`, pb: 2 }}>
                           <Typography sx={{ color: mode==="light"?"#666":"#aaa", fontWeight: 600 }}>Account Status</Typography>
                           <Box sx={{ background:"rgba(0,200,100,0.1)", color:"#00a050", px:2, py:0.5, borderRadius: "20px", fontSize:"0.85rem", fontWeight:800 }}>VERIFIED</Box>
                        </Box>
                     </Box>

                     <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                          variant={isEditing ? "contained" : "outlined"} 
                          onClick={async () => {
                            if (isEditing && auth.currentUser) {
                                // Save to Firebase Auth to persist across navigation!
                                try {
                                   await updateProfile(auth.currentUser, { displayName: editName });
                                } catch (error) {
                                   console.error("Failed to update profile", error);
                                }
                            }
                            setIsEditing(!isEditing);
                          }} 
                          sx={{ 
                            background: isEditing ? "linear-gradient(135deg, #667eea, #764ba2)" : "transparent", 
                            color: isEditing ? "white" : (mode==="light"?"#1a1a1a":"#fff"), 
                            borderColor: isEditing ? "transparent" : (mode==="light"?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.2)"),
                            borderRadius: "12px", 
                            px: 4, 
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600
                          }}
                        >
                          {isEditing ? "Save Details" : "Edit Profile"}
                        </Button>
                     </Box>
                  </Box>
               )}

               {/* USAGE LIMITS TAB */}
               {activeTab === 1 && (
                  <Box sx={{ display:"flex", flexDirection:"column", gap: 4 }}>
                    {/* Beta Status Card */}
                    <Box sx={{ background: mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(35,35,35,0.6)", backdropFilter:"blur(12px)", p: 4, borderRadius: "24px", border: `1px solid ${mode==="light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)"}`, boxShadow: mode==="light"?"0 10px 40px rgba(0,0,0,0.04)":"none" }}>
                       <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb: 2 }}>
                         <Typography variant="h5" sx={{ fontWeight: 800, color: mode==="light" ? "#1a1a1a" : "#fff" }}>Current Status: Unlimited Beta</Typography>
                         <Box sx={{ background:"rgba(0, 196, 159, 0.15)", color:"#00a080", px:2, py:0.5, borderRadius: "20px", fontSize:"0.9rem", fontWeight:800, letterSpacing:"0.5px" }}>100% FREE</Box>
                       </Box>
                       <Typography sx={{ color: mode==="light"?"#666":"#aaa", mb: 0, fontSize:"1.05rem" }}>
                         Thank you for being an early adopter. During this beta phase, you have unlimited access to all professional AI health queries and data visualization exports at no cost.
                       </Typography>
                    </Box>

                    {/* Usage Insights */}
                    <Box sx={{ background: mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(35,35,35,0.6)", backdropFilter:"blur(12px)", p: 4, borderRadius: "24px", border: `1px solid ${mode==="light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)"}`, boxShadow: mode==="light"?"0 10px 40px rgba(0,0,0,0.04)":"none" }}>
                       <Typography variant="h6" sx={{ fontWeight: 800, color: mode==="light" ? "#1a1a1a" : "#fff", mb: 3 }}>Monthly Core Usage</Typography>
                       <Box sx={{ display:"flex", justifyContent:"space-between", mb: 1 }}>
                         <Typography sx={{ color: mode==="light"?"#555":"#ccc", fontWeight:700 }}>14 / 20 Queries Used</Typography>
                         <Typography sx={{ color: mode==="light"?"#888":"#777", fontWeight: 500 }}>Resets in 12 days</Typography>
                       </Box>
                       <LinearProgress variant="determinate" value={70} sx={{ height: 12, borderRadius: 6, background: mode==="light"?"rgba(0,0,0,0.05)":"rgba(255,255,255,0.1)", "& .MuiLinearProgress-bar": { background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 6 } }} />
                    </Box>
                  </Box>
               )}

               {/* SECURITY TAB */}
               {activeTab === 2 && (
                  <Box sx={{ display:"flex", flexDirection:"column", gap: 4 }}>
                    <Box sx={{ background: mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(35,35,35,0.6)", backdropFilter:"blur(12px)", p: 4, borderRadius: "24px", border: `1px solid ${mode==="light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)"}`, boxShadow: mode==="light"?"0 10px 40px rgba(0,0,0,0.04)":"none" }}>
                       <Typography variant="h5" sx={{ fontWeight: 800, color: mode==="light" ? "#1a1a1a" : "#fff", mb: 2 }}>Password & Access</Typography>
                       <Typography sx={{ color: mode==="light"?"#666":"#aaa", mb: 4 }}>Maintain the security of your account and manage active authentication sessions.</Typography>
                       <Button variant="outlined" sx={{ textTransform:"none", border:`1px solid ${mode==="light"?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.2)"}`, color: mode==="light"?"#1a1a1a":"#fff", borderRadius:"12px", px:4, py: 1.2, fontWeight:600 }}>Change Password</Button>
                    </Box>

                    {/* DANGER ZONE */}
                    <Box sx={{ border: "1px solid rgba(255,75,75,0.3)", background: "rgba(255,75,75,0.03)", p: 4, borderRadius: "24px" }}>
                       <Typography variant="h5" sx={{ fontWeight: 800, color: "#FF4B4B", mb: 1 }}>Danger Zone</Typography>
                       <Typography sx={{ color: mode==="light"?"#666":"#aaa", mb: 4 }}>Ending your session securely terminates all active tokens associated with your instance.</Typography>
                       <Button
                         variant="contained"
                         onClick={logout}
                         sx={{
                           background: "linear-gradient(135deg, #FF6B6B 0%, #FF4B4B 100%)",
                           "&:hover": {
                             background: "linear-gradient(135deg, #FF5555 0%, #D93838 100%)",
                             boxShadow: "0 8px 16px rgba(255, 75, 75, 0.3)",
                           },
                           padding: "12px 28px",
                           fontSize: "1.05rem",
                           fontWeight: 700,
                           borderRadius: "12px",
                           boxShadow: "0 4px 12px rgba(255, 75, 75, 0.2)",
                           textTransform: "none",
                           color: "white",
                         }}>
                         Logout Securely
                       </Button>
                    </Box>
                  </Box>
               )}

            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
