import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ width: "100%" }}>
        <Navbar />
        <Box sx={{ padding: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
