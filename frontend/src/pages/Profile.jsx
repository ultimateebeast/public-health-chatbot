import { Box, Typography, Paper } from "@mui/material";

export default function Profile() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Profile
      </Typography>

      <Paper sx={{ padding: 3 }}>
        <Typography>User details will be shown here.</Typography>
      </Paper>
    </Box>
  );
}
