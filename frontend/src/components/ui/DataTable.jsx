import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { useThemeContext } from "../../hooks/useThemeContext";

export default function DataTable({ headers, rows, renderRow }) {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        background:
          mode === "light"
            ? "rgba(255,255,255,0.85)"
            : "rgba(30,30,30,0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        border:
          mode === "light"
            ? "1px solid rgba(255,255,255,0.5)"
            : "1px solid rgba(255,255,255,0.05)",
        p: { xs: 2, md: 4 },
        overflowX: "auto",
        boxShadow: mode === "light" ? "0 10px 30px rgba(0,0,0,0.02)" : "0 8px 32px rgba(0,0,0,0.2)",
      }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell
                key={i}
                sx={{
                  borderBottom:
                    mode === "light" ? "1px solid #eee" : "1px solid #333",
                  color: mode === "light" ? "#888" : "#aaa",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  letterSpacing: "0.5px",
                }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => renderRow(row, index, mode))}
        </TableBody>
      </Table>
    </Box>
  );
}
