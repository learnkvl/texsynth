import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Container, 
  Divider,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery
} from '@mui/material';


// Import Material icons
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Import page components
import HomePage from '../components/HomePage';
import DocumentBrowser from '../components/document/DocumentBrowser';
import DocumentDetail from '../components/document/DocumentDetail';
import DocumentUpload from '../components/document/DocumentUpload';
import CaseManagement from '../components/case/CaseManagement';
import CaseDetail from '../components/case/CaseDetail';
import CaseCreateForm from '../components/case/CaseCreateForm';
import InvoiceList from '../components/invoicing/InvoiceList';
import EnhancedInvoiceUpload from '../components/invoicing/EnhancedInvoiceUpload';
import InvoiceCreation from '../components/invoicing/InvoiceCreation';
import Settings from '../components/Settings';
import Dashboard from '../components/dashboard/Dashboard';
import theme from '../theme';

import TemplateDetection from '../components/invoicing/TemplateDetection';
import OCREnhancement from '../components/invoicing/OCREnhancement';

// Logo component
const Logo = () => (
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 700,
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DescriptionIcon sx={{ mr: 1 }} />
     TexSynth
    </Typography>
  );
  
  // Navigation items configuration
  const navigationItems = [
    { text: 'Home', icon: <DescriptionIcon />, path: '/' },
    { text: 'Dashboard', icon: <BarChartIcon />, path: '/dashboard' },
    { text: 'Search & Retrieve', icon: <SearchIcon />, path: '/documents' },
    { text: 'Case Management', icon: <FolderIcon />, path: '/cases' },
    { text: 'Document Upload', icon: <CloudUploadIcon />, path: '/upload' },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

const SideBar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const drawerWidth = 240;
  
    // Handle drawer toggle
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    // Handle profile menu
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleProfileMenuClose = () => {
      setAnchorEl(null);
    };
  
    // Handle notifications menu
    const handleNotificationsOpen = (event) => {
      setNotificationsAnchorEl(event.currentTarget);
    };
  
    const handleNotificationsClose = () => {
      setNotificationsAnchorEl(null);
    };
  
    // Get page title based on current path
    const getPageTitle = () => {
      const pathBase = '/' + location.pathname.split('/')[1];
      const item = navigationItems.find(item => item.path === pathBase);
      
      if (item) {
        return item.text;
      }
      
      // Handle special cases
      if (location.pathname.includes('/document/')) {
        return 'Document Detail';
      } else if (location.pathname.includes('/case/')) {
        return 'Case Detail';
      } else if (location.pathname.includes('/invoice/')) {
        return 'Invoice Detail';
      }
      
      return 'DebtDoc Discovery';
    };
  
    // Drawer content
    const drawer = (
      <>
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: isSmallScreen ? 'space-between' : 'center',
          px: 2,
        }}>
          {isSmallScreen ? (
            <>
              <Logo />
              <IconButton 
                onClick={handleDrawerToggle}
                size="large"
                edge="end"
                color="inherit"
                aria-label="close menu"
              >
                <CloseIcon color='primary' />
              </IconButton>
            </>
          ) : (
            <Box sx={{ py: 1.5 }}>
              <Logo />
            </Box>
          )}
        </Toolbar>
        <Divider />
        <List component="nav" sx={{ pt: 2 }}>
          {navigationItems.map((item) => {
            const pathBase = '/' + location.pathname.split('/')[1];
            const isSelected = pathBase === item.path ;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  selected={isSelected}
                  onClick={isSmallScreen ? handleDrawerToggle : undefined}
                  sx={{
                    borderRadius: '0 24px 24px 0',
                    mr: 2,
                    ml: 0,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      }
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ mt: 'auto' }} />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            DebtDoc Discovery v1.0
          </Typography>
        </Box>
      </>
    );
  
    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {getPageTitle()}
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Help button */}
            <Tooltip title="Help">
              <IconButton color="inherit">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNotificationsClose}>New case assigned</MenuItem>
              <MenuItem onClick={handleNotificationsClose}>5 documents ready for review</MenuItem>
              <MenuItem onClick={handleNotificationsClose}>System update available</MenuItem>
            </Menu>
            
            {/* User profile */}
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleProfileMenuOpen} 
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>JD</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        
        {/* Sidebar navigation - responsive drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            height: '100vh',
            overflow: 'auto',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          
          <Container maxWidth="xl" sx={{ flex: 1, py: 2 }}>
            {/* Routes */}
            <Routes>
            <Route path="/" element={<HomePage />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentBrowser />} />
              <Route path="/document/:id" element={<DocumentDetail />} />
              <Route path="/upload" element={<DocumentUpload />} />
              <Route path="/cases" element={<CaseManagement />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/cases/create" element={<CaseCreateForm />} />
              <Route path="/invoices" element={<InvoiceList />} />
              {/* <Route path="/invoices/:id" element={<TemplateDetection />} /> */}
              <Route path="/invoices/upload" element={<EnhancedInvoiceUpload />} />
              <Route path="/invoices/create" element={<InvoiceCreation />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    );
  }

  export default SideBar;