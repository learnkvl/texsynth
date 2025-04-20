// src/components/CaseManagement.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function CaseManagement() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Case Management</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          This is a placeholder for the Case Management functionality. 
          This would include features to organize documents by case, 
          manage case metadata, and track case progress.
        </Typography>
      </Paper>
    </Box>
  );
}

export default CaseManagement;
