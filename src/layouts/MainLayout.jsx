// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  InputBase,
  alpha,
  useMediaQuery,
  CssBaseline,
  Container,
  Breadcrumbs,
  Link,
  Button
} from '@mui/material';




// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpIcon from '@mui/icons-material/Help';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';


// App store
import { useAppStore } from '../AppRouter';
import TemplateDetection from '../components/invoicing/TemplateDetection';
import OCREnhancement from '../components/invoicing/OCREnhancement';

// Drawer width
const drawerWidth = 240;

// Styled components for the layout
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get global state from Zustand store
  const { 
    sidebarOpen, 
    toggleSidebar, 
    theme: themeMode, 
    setTheme 
  } = useAppStore();
  
  // User menu state
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Cases', icon: <FolderIcon />, path: '/cases' },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];
  
  // Helper to check if a nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle user menu open
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  // Handle notifications menu open
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  // Handle notifications menu close
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(themeMode === 'light' ? 'dark' : 'light');
  };
  
  // Handle upload document
  const handleUploadDocument = () => {
    navigate('/documents/upload');
  };
  
  // Get the current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/documents')) return 'Documents';
    if (path.startsWith('/cases')) return 'Cases';
    if (path.startsWith('/invoices')) return 'Invoices';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Debt Collection eDiscovery';
  };
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    if (paths.length === 0) return null;
    
    return (
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit" 
          underline="hover"
        >
          Home
        </Link>
        
        {paths.map((path, index) => {
          // Skip ID parts in the breadcrumb
          if (path.match(/^[0-9a-fA-F-]+$/)) return null;
          
          // Calculate the link path
          const linkPath = `/${paths.slice(0, index + 1).join('/')}`;
          
          // Format the path name for display
          const displayPath = path.charAt(0).toUpperCase() + path.slice(1);
          
          // Check if this is the last item
          const isLast = index === paths.length - 1;
          
          return isLast ? (
            <Typography color="text.primary" key={linkPath}>
              {displayPath}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={linkPath}
              color="inherit"
              underline="hover"
              key={linkPath}
            >
              {displayPath}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBarStyled position="fixed" open={sidebarOpen && !isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            {isMobile || !sidebarOpen ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Debt Collection eDiscovery
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDocument}
              size="small"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Upload
            </Button>
            
            <Tooltip title="Toggle theme">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleThemeToggle}
              >
                {themeMode === 'dark' ? <LightModeIcon /> : <NightlightIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Help">
              <IconButton
                size="large"
                color="inherit"
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <IconButton
              edge="end"
              onClick={handleUserMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar alt="John Doe" src="/static/avatar.jpg" sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBarStyled>
      
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={isMobile ? sidebarOpen : sidebarOpen}
        onClose={toggleSidebar}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, width: '100%' }}>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              DC eDiscovery
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 'bold' : 'regular',
                    }}
                  />
                  {item.text === 'Documents' && (
                    <Badge badgeContent={2} color="error" sx={{ mr: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ px: 3, pb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDocument}
            >
              Upload Document
            </Button>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Main open={sidebarOpen && !isMobile}>
        <DrawerHeader />
        
        {/* Breadcrumbs */}
        {generateBreadcrumbs()}
        
        {/* Page Content */}
        <Container maxWidth="xl" disableGutters>
          <Outlet />
        </Container>
      </Main>
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">John Doe</Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@example.com
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => {
          handleUserMenuClose();
          navigate('/settings');
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleUserMenuClose();
          navigate('/settings');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Notifications</Typography>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemText 
            primary="Document processing complete" 
            secondary="Smith_CreditCard_Statement.pdf was processed with 92% confidence"
            secondaryTypographyProps={{ noWrap: true }}
          />
        </MenuItem>
        <MenuItem>
          <ListItemText 
            primary="New case assigned" 
            secondary="You have been assigned to 'Williams Auto Loan' case"
            secondaryTypographyProps={{ noWrap: true }}
          />
        </MenuItem>
        <MenuItem>
          <ListItemText 
            primary="Processing error" 
            secondary="Davis_Mortgage_Notice.pdf needs manual review"
            secondaryTypographyProps={{ noWrap: true }}
          />
        </MenuItem>
        <TemplateDetection
            ocrData={yourOcrData}
            onTemplateDetected={(results) => {
              console.log('Detected template:', results);
              // Handle the template detection results
            }}
          />

// In your component
<OCREnhancement
  ocrData={yourOcrData}
  templateType="Collection Services"  // Or dynamically determined template
  onEnhancement={(enhancedData, qualityChecks) => {
    console.log('Enhanced data:', enhancedData);
    console.log('Quality checks:', qualityChecks);
    // Update your form with enhanced data
  }}
/>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" onClick={handleNotificationsClose}>
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}
export default MainLayout;