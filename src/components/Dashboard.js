// src/components/Dashboard.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          This is a placeholder for the Dashboard view. 
          This would include summary statistics, recent documents, 
          active cases, and other overview information.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
