// src/components/dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Avatar, 
  Chip, 
  Menu, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Badge,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


// Chart components
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Icons
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import GavelIcon from '@mui/icons-material/Gavel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SchoolIcon from '@mui/icons-material/School';

// Mock data for the dashboard
// Overall stats
const overallStats = {
  totalCases: 47,
  activeCases: 32,
  totalDocuments: 256,
  totalInvoices: 25,
  totalDebtAmount: 780250.50,
  collectedAmount: 125750.25,
  lastMonthCollected: 45200.75,
  documentsPendingReview: 12,
  overdueCases: 5,
  monthlyRecoveryTarget: 90000
};

// Recent cases
const recentCases = [
  { 
    id: 'case-001', 
    name: 'Smith Credit Card Debt', 
    client: 'ABC Collections', 
    debtorName: 'John Smith',
    accountType: 'Credit Card',
    totalAmount: 5095.97,
    status: 'active',
    lastActivity: '2025-04-12',
    daysOpen: 28
  },
  { 
    id: 'case-002', 
    name: 'Johnson Medical Debt', 
    client: 'Healthcare Recovery',
    debtorName: 'Mary Johnson',
    accountType: 'Medical',
    totalAmount: 13950.50,
    status: 'pending',
    lastActivity: '2025-04-10',
    daysOpen: 20
  },
  { 
    id: 'case-003', 
    name: 'Williams Auto Loan', 
    client: 'Auto Finance Recovery',
    debtorName: 'Robert Williams',
    accountType: 'Auto Loan',
    totalAmount: 9706.00,
    status: 'active',
    lastActivity: '2025-04-15',
    daysOpen: 18
  },
  { 
    id: 'case-004', 
    name: 'Davis Mortgage Default', 
    client: 'Homeowner Solutions',
    debtorName: 'Jennifer Davis',
    accountType: 'Mortgage',
    totalAmount: 49000.75,
    status: 'legal',
    lastActivity: '2025-04-08',
    daysOpen: 45
  },
  { 
    id: 'case-005', 
    name: 'Brown Student Loan', 
    client: 'Education Recovery',
    debtorName: 'Michael Brown',
    accountType: 'Student Loan',
    totalAmount: 20950.75,
    status: 'pending',
    lastActivity: '2025-04-14',
    daysOpen: 12
  }
];

// Recent documents
const recentDocuments = [
  {
    id: 'doc-001',
    name: 'Smith_CreditCard_Statement_Feb2025.pdf',
    case: 'Smith Credit Card Debt',
    type: 'Account Statement',
    uploaded: '2025-04-10',
    status: 'processed',
    confidence: 92.5
  },
  {
    id: 'doc-002',
    name: 'Johnson_Medical_Bill_March2025.pdf',
    case: 'Johnson Medical Debt',
    type: 'Invoice',
    uploaded: '2025-04-11',
    status: 'pending',
    confidence: 0
  },
  {
    id: 'doc-003',
    name: 'Williams_AutoLoan_Agreement.pdf',
    case: 'Williams Auto Loan',
    type: 'Credit Agreement',
    uploaded: '2025-04-12',
    status: 'processed',
    confidence: 88.3
  },
  {
    id: 'doc-004',
    name: 'Davis_Mortgage_Notice_Default.pdf',
    case: 'Davis Mortgage Default',
    type: 'Default Notice',
    uploaded: '2025-04-08',
    status: 'processed',
    confidence: 95.1
  },
  {
    id: 'doc-005',
    name: 'Smith_CreditCard_CollectionLetter.pdf',
    case: 'Smith Credit Card Debt',
    type: 'Collection Notice',
    uploaded: '2025-04-15',
    status: 'processing',
    confidence: 0
  }
];

// Monthly collection data
const monthlyCollectionData = [
  { name: 'Jan', collected: 32500, target: 80000 },
  { name: 'Feb', collected: 48750, target: 85000 },
  { name: 'Mar', collected: 65200, target: 85000 },
  { name: 'Apr', collected: 45200, target: 90000 },
  { name: 'May', collected: 0, target: 90000 },
  { name: 'Jun', collected: 0, target: 95000 }
];

// Distribution by debt type
const debtTypeDistribution = [
  { name: 'Credit Card', value: 255000 },
  { name: 'Medical', value: 187000 },
  { name: 'Auto Loan', value: 125000 },
  { name: 'Mortgage', value: 175000 },
  { name: 'Student Loan', value: 38250 }
];

// Case status distribution
const caseStatusDistribution = [
  { name: 'Active', value: 32 },
  { name: 'Pending', value: 8 },
  { name: 'Legal', value: 7 },
  { name: 'Closed', value: 15 }
];

// Collection trends
const collectionTrends = [
  { date: '2025-01-01', collected: 7500 },
  { date: '2025-01-08', collected: 10000 },
  { date: '2025-01-15', collected: 8500 },
  { date: '2025-01-22', collected: 6500 },
  { date: '2025-02-01', collected: 12000 },
  { date: '2025-02-08', collected: 15500 },
  { date: '2025-02-15', collected: 9250 },
  { date: '2025-02-22', collected: 12000 },
  { date: '2025-03-01', collected: 18000 },
  { date: '2025-03-08', collected: 13500 },
  { date: '2025-03-15', collected: 16700 },
  { date: '2025-03-22', collected: 17000 },
  { date: '2025-04-01', collected: 14500 },
  { date: '2025-04-08', collected: 13200 },
  { date: '2025-04-15', collected: 17500 }
];

// Top case handlers
const topCaseHandlers = [
  { name: 'Sarah Adams', casesHandled: 15, amountCollected: 45750.50 },
  { name: 'John Doe', casesHandled: 12, amountCollected: 38200.75 },
  { name: 'Michael Johnson', casesHandled: 10, amountCollected: 26500.00 },
  { name: 'Emily Turner', casesHandled: 8, amountCollected: 18750.25 },
  { name: 'David Wilson', casesHandled: 5, amountCollected: 12550.00 }
];

// Tasks and reminders
const tasks = [
  { id: 1, task: 'Review Johnson Medical documents', dueDate: '2025-04-20', priority: 'high', status: 'pending' },
  { id: 2, task: 'Prepare legal filing for Davis case', dueDate: '2025-04-22', priority: 'high', status: 'pending' },
  { id: 3, task: 'Follow up on Williams payment plan', dueDate: '2025-04-25', priority: 'medium', status: 'pending' },
  { id: 4, task: 'Send final notice to Smith', dueDate: '2025-04-21', priority: 'medium', status: 'pending' },
  { id: 5, task: 'Update Brown account information', dueDate: '2025-04-19', priority: 'low', status: 'pending' }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helper functions
// Get account type icon
const getAccountTypeIcon = (accountType) => {
  switch(accountType) {
    case 'Credit Card':
      return <CreditCardIcon />;
    case 'Medical':
      return <LocalHospitalIcon />;
    case 'Auto Loan':
      return <DirectionsCarIcon />;
    case 'Mortgage':
      return <HomeIcon />;
    case 'Student Loan':
      return <SchoolIcon />;
    default:
      return <DescriptionIcon />;
  }
};

// Get case status chip
const getCaseStatusChip = (status) => {
  switch(status) {
    case 'active':
      return (
        <Chip 
          label="Active" 
          color="primary" 
          size="small" 
        />
      );
    case 'pending':
      return (
        <Chip 
          label="Pending Review" 
          color="warning" 
          size="small" 
        />
      );
    case 'legal':
      return (
        <Chip 
          icon={<GavelIcon />}
          label="Legal Proceedings" 
          color="error" 
          size="small" 
        />
      );
    case 'closed':
      return (
        <Chip 
          icon={<CheckCircleIcon />}
          label="Closed" 
          color="success" 
          size="small" 
        />
      );
    default:
      return (
        <Chip 
          label={status} 
          size="small" 
        />
      );
  }
};

// Get document status chip
const getDocumentStatusChip = (status, confidence) => {
  switch (status) {
    case 'processed':
      return (
        <Chip 
          icon={<CheckCircleIcon />} 
          label={`Processed (${confidence.toFixed(1)}%)`} 
          color="success" 
          size="small" 
        />
      );
    case 'processing':
      return (
        <Chip 
          icon={<HourglassEmptyIcon />} 
          label="Processing" 
          color="primary" 
          size="small" 
        />
      );
    case 'pending':
      return (
        <Chip 
          icon={<AccessTimeIcon />} 
          label="Pending" 
          color="default" 
          size="small" 
        />
      );
    case 'error':
      return (
        <Chip 
          icon={<WarningIcon />} 
          label="Error" 
          color="error" 
          size="small" 
        />
      );
    default:
      return (
        <Chip 
          label={status} 
          size="small" 
        />
      );
  }
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Get task priority icon
const getTaskPriorityIcon = (priority) => {
  switch(priority) {
    case 'high':
      return <FlagIcon color="error" />;
    case 'medium':
      return <FlagIcon color="warning" />;
    case 'low':
      return <FlagIcon color="primary" />;
    default:
      return <FlagIcon />;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [taskMenuAnchorEl, setTaskMenuAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [taskTabValue, setTaskTabValue] = useState(0);
  
  // Handle task menu open
  const handleTaskMenuOpen = (event, task) => {
    event.preventDefault();
    event.stopPropagation();
    setTaskMenuAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };
  
  // Handle task menu close
  const handleTaskMenuClose = () => {
    setTaskMenuAnchorEl(null);
  };
  
  // Handle task details open
  const handleTaskDetailsOpen = (task) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
    handleTaskMenuClose();
  };
  
  // Handle task details close
  const handleTaskDetailsClose = () => {
    setTaskDetailsOpen(false);
  };
  
  // Handle task tab change
  const handleTaskTabChange = (event, newValue) => {
    setTaskTabValue(newValue);
  };
  
  // Handle navigation to various pages
  const navigateToUpload = () => navigate('/upload');
  const navigateToCases = () => navigate('/cases');
  const navigateToInvoices = () => navigate('/invoices');
  const navigateToCase = (caseId) => navigate(`/cases/${caseId}`);
  const navigateToDocument = (documentId) => navigate(`/document/${documentId}`);
  
  // Calculate collection performance percentage
  const currentMonthCollectionPerformance = (monthlyCollectionData[3].collected / monthlyCollectionData[3].target) * 100;
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* High Level Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3} >
          <Card sx={{ minWidth: '275px' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Active Cases
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {overallStats.activeCases}
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <FolderIcon />
                </Avatar>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Cases
                </Typography>
                <Typography variant="body2">
                  {overallStats.totalCases}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Debt Amount
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {formatCurrency(overallStats.totalDebtAmount).split('.')[0]}
                </Typography>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Collected
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(overallStats.collectedAmount).split('.')[0]}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Documents Processed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {overallStats.totalDocuments}
                </Typography>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <DescriptionIcon />
                </Avatar>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Pending Review
                </Typography>
                <Typography variant="body2">
                  {overallStats.documentsPendingReview}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Monthly Collection
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {formatCurrency(overallStats.lastMonthCollected).split('.')[0]}
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <AccountBalanceIcon />
                </Avatar>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Target: {formatCurrency(overallStats.monthlyRecoveryTarget)}
                  </Typography>
                  <Typography variant="body2">
                    {currentMonthCollectionPerformance.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={currentMonthCollectionPerformance}
                  color={currentMonthCollectionPerformance >= 80 ? "success" : currentMonthCollectionPerformance >= 50 ? "primary" : "warning"}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={navigateToUpload}
            fullWidth
            sx={{ py: 1 }}
          >
            Upload Documents
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={navigateToCases}
            fullWidth
            sx={{ py: 1 }}
          >
            View Cases
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={navigateToInvoices}
            fullWidth
            sx={{ py: 1 }}
          >
            Manage Invoices
          </Button>
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Tasks & Reminders */}
        <Grid size={{ xs: 12, md: 6 ,lg:4}} >  
          <Card >
            <CardHeader 
              title="Tasks & Reminders" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                >
                  New Task
                </Button>
              }
            />
            <Divider />
            <CardContent  >
              <Tabs
                value={taskTabValue}
                onChange={handleTaskTabChange}
                variant="fullWidth"
                sx={{ mb: 1 }}
              >
                <Tab label="Upcoming" />
                <Tab label="All Tasks" />
              </Tabs>
              
              <List sx={{overflowY:"auto",maxHeight:"253px",scrollbarWidth:"none"}} >
                {tasks.map((task) => (
                  <ListItemButton 
                    key={task.id}
                    onClick={() => handleTaskDetailsOpen(task)}
                    sx={{ 
                      borderLeft: 3, 
                      borderColor: 
                        task.priority === 'high' ? 'error.main' :
                        task.priority === 'medium' ? 'warning.main' : 'primary.main',
                      my: 1,
                      mx: 1,
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      {getTaskPriorityIcon(task.priority)}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.task}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <CalendarTodayIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Due: {formatDate(task.dueDate)}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      edge="end"
                      onClick={(e) => handleTaskMenuOpen(e, task)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Cases */}
        <Grid size={{ xs: 12, md: 6 ,lg:8}} >
          <Card>
            <CardHeader 
              title="Recent Cases" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button
                  size="small"
                  component={RouterLink}
                  to="/cases"
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{scrollbarWidth:"none"}}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Case</TableCell>
                      <TableCell>Debtor</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Days Open</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentCases.map((caseItem) => (
                      <TableRow 
                        key={caseItem.id} 
                        hover
                        onClick={() => navigateToCase(caseItem.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 28, 
                                height: 28, 
                                mr: 1,
                                bgcolor: 'primary.light'
                              }}
                            >
                              <FolderIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                              {caseItem.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{caseItem.debtorName}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getAccountTypeIcon(caseItem.accountType)}
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {caseItem.accountType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            ${caseItem.totalAmount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getCaseStatusChip(caseItem.status)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={caseItem.daysOpen}
                            size="small"
                            color={
                              caseItem.daysOpen > 30 ? "error" :
                              caseItem.daysOpen > 15 ? "warning" : "default"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Collection Performance Chart */}
        <Grid size={{ xs: 12, md: 6 ,}} >
          <Card>
            <CardHeader 
              title="Monthly Collection Performance" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <IconButton size="small">
                  <FileDownloadIcon fontSize="small" />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyCollectionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar name="Collected" dataKey="collected" fill="#8884d8" />
                    <Bar name="Target" dataKey="target" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Debt Type Distribution */}
        <Grid size={{ xs: 12, md: 6 ,}}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Debt Type Distribution" 
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={debtTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {debtTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                  {debtTypeDistribution.map((entry, index) => (
                    <Chip
                      key={index}
                      label={entry.name}
                      size="small"
                      sx={{ bgcolor: COLORS[index % COLORS.length], color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Documents */}
        <Grid size={{ xs: 12, md: 6 ,}}>
          <Card sx={{maxHeight: 455,}}>
            <CardHeader 
              title="Recent Documents" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button
                  size="small"
                  component={RouterLink}
                  to="/upload"
                >
                  Upload
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{pb:3}} >
              <List sx={{ maxHeight: 430, overflow: 'auto',scrollbarWidth:"none" ,}}>
                {recentDocuments.map((document) => (
                  <ListItemButton sx={{ mb: 1, mx: 1, borderRadius: 1 }}
                    key={document.id}
                    onClick={() => navigateToDocument(document.id)}
                  >
                    <ListItemIcon>
                      <DescriptionIcon color={
                        document.status === 'processed' ? 'success' :
                        document.status === 'processing' ? 'primary' :
                        document.status === 'pending' ? 'action' : 'error'
                      } />
                    </ListItemIcon>
                    <ListItemText
                      primary={document.name}
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Case: {document.case}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded: {formatDate(document.uploaded)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box>
                      {getDocumentStatusChip(document.status, document.confidence)}
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Collection Trends */}
        <Grid size={{ xs: 12, md: 6 ,}}>
          <Card>
            <CardHeader 
              title="Collection Trends" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <IconButton size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={collectionTrends}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="collected" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Case Status Distribution & Top Performers */}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 ,}}>
              <Card>
                <CardHeader 
                  title="Case Status Distribution" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 262 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={caseStatusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {caseStatusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 ,}}>
              <Card>
                <CardHeader 
                  title="Top Case Handlers" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="center">Cases Handled</TableCell>
                          <TableCell align="right">Amount Collected</TableCell>
                          <TableCell align="right">Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topCaseHandlers.map((handler, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    width: 28, 
                                    height: 28, 
                                    mr: 1,
                                    bgcolor: index === 0 ? 'success.light' : 'primary.light'
                                  }}
                                >
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                {handler.name}
                              </Box>
                            </TableCell>
                            <TableCell align="center">{handler.casesHandled}</TableCell>
                            <TableCell align="right">{formatCurrency(handler.amountCollected)}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={(handler.amountCollected / topCaseHandlers[0].amountCollected) * 100}
                                  sx={{ width: 100, mr: 1, height: 8, borderRadius: 1 }}
                                  color={index === 0 ? "success" : "primary"}
                                />
                                <Typography variant="body2">
                                  {((handler.amountCollected / topCaseHandlers[0].amountCollected) * 100).toFixed(0)}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

      
      {/* Task Menu */}
      <Menu
        anchorEl={taskMenuAnchorEl}
        open={Boolean(taskMenuAnchorEl)}
        onClose={handleTaskMenuClose}
      >
        <MenuItem onClick={() => handleTaskDetailsOpen(selectedTask)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTaskMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTaskMenuClose}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark Complete</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleTaskMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Task Detail Dialog */}
      <Dialog
        open={taskDetailsOpen}
        onClose={handleTaskDetailsClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Task Details
          <IconButton
            onClick={handleTaskDetailsClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTask && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert 
                  severity={
                    selectedTask.priority === 'high' ? "error" : 
                    selectedTask.priority === 'medium' ? "warning" : "info"
                  }
                  icon={getTaskPriorityIcon(selectedTask.priority)}
                >
                  <Typography variant="subtitle2">
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority Task
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedTask.task}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Due: {formatDate(selectedTask.dueDate)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Task Notes
                </Typography>
                <Typography variant="body2">
                  This is a sample task note. In a real application, this would contain additional details, context, and any notes associated with the task.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Related Case
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1,
                        bgcolor: 'primary.light'
                      }}
                    >
                      <FolderIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1">
                      Davis Mortgage Default
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskDetailsClose}>Close</Button>
          <Button color="primary" variant="contained">Mark as Complete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;