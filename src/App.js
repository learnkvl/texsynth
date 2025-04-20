// src/App.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import theme from './theme';
import AppLayout from './layouts/sideBar';
import SideBar from './layouts/sideBar';



// Main App component with ThemeProvider and Router
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* <AppLayout /> */}
        <SideBar />
      </Router>
    </ThemeProvider>
  );
}

export default App;