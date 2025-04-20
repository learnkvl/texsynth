// src/components/dashboard/DebtCollectionDashboard.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  IconButton, 
  Tabs, 
  Tab,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Badge,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  useTheme
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  // Add these to your existing imports
  List,
  ListItem, 
  ListItemAvatar,
  AlertTitle
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimerIcon from '@mui/icons-material/Timer';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import PublishIcon from '@mui/icons-material/Publish';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Mock data for recent cases
const recentCases = [
  { 
    id: 'case-001', 
    name: 'Smith Credit Card Debt', 
    client: 'ABC Collections', 
    debtorName: 'John Smith',
    accountType: 'Credit Card',
    principalAmount: 4250.75,
    interestAmount: 845.22,
    totalAmount: 5095.97,
    status: 'active',
    lastActivity: '2025-04-12',
    documentCount: 8,
    overdueDocuments: 0
  },
  { 
    id: 'case-002', 
    name: 'Johnson Medical Debt', 
    client: 'Healthcare Recovery',
    debtorName: 'Mary Johnson',
    accountType: 'Medical',
    principalAmount: 12750.50,
    interestAmount: 1200.00,
    totalAmount: 13950.50,
    status: 'pending',
    lastActivity: '2025-04-10',
    documentCount: 12,
    overdueDocuments: 2
  },
  { 
    id: 'case-003', 
    name: 'Williams Auto Loan', 
    client: 'Auto Finance Recovery',
    debtorName: 'Robert Williams',
    accountType: 'Auto Loan',
    principalAmount: 8455.25,
    interestAmount: 1250.75,
    totalAmount: 9706.00,
    status: 'active',
    lastActivity: '2025-04-15',
    documentCount: 6,
    overdueDocuments: 0
  },
  { 
    id: 'case-004', 
    name: 'Davis Mortgage Default', 
    client: 'Homeowner Solutions',
    debtorName: 'Jennifer Davis',
    accountType: 'Mortgage',
    principalAmount: 45750.00,
    interestAmount: 3250.75,
    totalAmount: 49000.75,
    status: 'legal',
    lastActivity: '2025-04-08',
    documentCount: 15,
    overdueDocuments: 0
  },
  { 
    id: 'case-005', 
    name: 'Brown Student Loan', 
    client: 'Education Recovery',
    debtorName: 'Michael Brown',
    accountType: 'Student Loan',
    principalAmount: 18500.25,
    interestAmount: 2450.50,
    totalAmount: 20950.75,
    status: 'pending',
    lastActivity: '2025-04-14',
    documentCount: 7,
    overdueDocuments: 1
  }
];

// Mock data for recent documents
const recentDocuments = [
  {
    id: 'doc-001',
    name: 'Smith_CreditCard_Statement_Feb2025.pdf',
    case: 'Smith Credit Card Debt',
    type: 'Account Statement',
    uploaded: '2025-04-10',
    status: 'processed',
    confidence: 92.5,
    size: '1.2 MB'
  },
  {
    id: 'doc-002',
    name: 'Johnson_Medical_Bill_March2025.pdf',
    case: 'Johnson Medical Debt',
    type: 'Invoice',
    uploaded: '2025-04-11',
    status: 'pending',
    confidence: 0,
    size: '2.4 MB'
  },
  {
    id: 'doc-003',
    name: 'Williams_AutoLoan_Agreement.pdf',
    case: 'Williams Auto Loan',
    type: 'Credit Agreement',
    uploaded: '2025-04-12',
    status: 'processed',
    confidence: 88.3,
    size: '3.5 MB'
  },
  {
    id: 'doc-004',
    name: 'Davis_Mortgage_Notice_Default.pdf',
    case: 'Davis Mortgage Default',
    type: 'Default Notice',
    uploaded: '2025-04-08',
    status: 'processed',
    confidence: 95.1,
    size: '1.8 MB'
  },
  {
    id: 'doc-005',
    name: 'Smith_CreditCard_CollectionLetter.pdf',
    case: 'Smith Credit Card Debt',
    type: 'Collection Notice',
    uploaded: '2025-04-15',
    status: 'processing',
    confidence: 0,
    size: '0.9 MB'
  },
  {
    id: 'doc-006',
    name: 'Brown_StudentLoan_Deferment.pdf',
    case: 'Brown Student Loan',
    type: 'Legal Filing',
    uploaded: '2025-04-14',
    status: 'error',
    confidence: 65.2,
    size: '1.5 MB'
  }
];

// Mock data for statistics
const statistics = {
  totalCases: 47,
  activeCases: 32,
  pendingReview: 8,
  legalProceedings: 7,
  documentsProcessed: 256,
  documentsAwaitingProcessing: 12,
  processingErrors: 3,
  totalDebtAmount: 780250.50,
  collectedAmount: 125750.25,
  successRate: 78.5
};

// Helper function to get account type icon
const getAccountTypeIcon = (accountType) => {
  switch (accountType) {
    case 'Credit Card':
      return <CreditCardIcon />;
    case 'Medical':
      return <LocalHospitalIcon />;
    case 'Auto Loan':
      return <DirectionsCarIcon />;
    case 'Mortgage':
      return <HomeIcon />;
    case 'Student Loan':
      return <AccountBalanceIcon />;
    default:
      return <DescriptionIcon />;
  }
};

// Helper function to get document status chip
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
          icon={<TimerIcon />} 
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

// Helper function to get case status chip
const getCaseStatusChip = (status) => {
  switch (status) {
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
    default:
      return (
        <Chip 
          label={status} 
          size="small" 
        />
      );
  }
};

function DebtCollectionDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle menu open
  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle case click
  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };
  
  // Handle document click
  const handleDocumentClick = (documentId) => {
    navigate(`/documents/${documentId}`);
  };
  
  // Handle upload document click
  const handleUploadDocument = () => {
    navigate('/documents/upload');
  };
  
  // Handle create invoice click
  const handleCreateInvoice = () => {
    navigate('/invoices/create');
  };
  
  // Handle create case click
  const handleCreateCase = () => {
    navigate('/cases/create');
  };
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Debt Collection Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage debt collection cases, documents, and invoices in one place.
        </Typography>
      </Box>
      
      {/* Quick Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="contained"
              fullWidth
              size="large"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDocument}
              sx={{ py: 1.5 }}
            >
              Upload Document
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<ReceiptIcon />}
              onClick={handleCreateInvoice}
              sx={{ py: 1.5 }}
            >
              Create Invoice
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<FolderIcon />}
              onClick={handleCreateCase}
              sx={{ py: 1.5 }}
            >
              Create Case
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<BarChartIcon />}
              sx={{ py: 1.5 }}
            >
              Analytics
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.light,
                      width: 40,
                      height: 40,
                      mr: 2
                    }}
                  >
                    <FolderIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="div">
                      {statistics.totalCases}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Total Cases
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Active
                    </Typography>
                    <Typography variant="body2">
                      {statistics.activeCases}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="body2">
                      {statistics.pendingReview}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Legal
                    </Typography>
                    <Typography variant="body2">
                      {statistics.legalProceedings}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.success.light,
                      width: 40,
                      height: 40,
                      mr: 2
                    }}
                  >
                    <DescriptionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="div">
                      {statistics.documentsProcessed}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Processed Documents
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="body2">
                      {statistics.documentsAwaitingProcessing}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Errors
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      {statistics.processingErrors}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Success Rate
                    </Typography>
                    <Typography variant="body2">
                      {statistics.successRate}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.error.light,
                      width: 40,
                      height: 40,
                      mr: 2
                    }}
                  >
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="div">
                      ${Math.floor(statistics.totalDebtAmount).toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Total Debt Amount
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ pt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Collected Amount
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ${Math.floor(statistics.collectedAmount).toLocaleString()}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(statistics.collectedAmount / statistics.totalDebtAmount) * 100} 
                      sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant="outlined">
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quick Upload
                </Typography>
                
                <Box 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    my: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={handleUploadDocument}
                >
                  <PublishIcon 
                    color="primary" 
                    sx={{ fontSize: 40, mb: 1 }} 
                  />
                  <Typography variant="body2">
                    Drop files here or click to upload
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DocumentScannerIcon />}
                  onClick={handleUploadDocument}
                  sx={{ mt: 1 }}
                >
                  Start OCR Processing
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Items Tabs */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Recent Cases" />
            <Tab label="Recent Documents" />
          </Tabs>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder={tabValue === 0 ? "Search cases..." : "Search documents..."}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {/* Recent Cases Tab */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Case Name</TableCell>
                  <TableCell>Debtor</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentCases.filter(caseItem => 
                  caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  caseItem.debtorName.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((caseItem) => (
                  <TableRow 
                    key={caseItem.id}
                    hover
                    onClick={() => handleCaseClick(caseItem.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: theme.palette.primary.light
                          }}
                        >
                          <FolderIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {caseItem.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{caseItem.debtorName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            mr: 1,
                            bgcolor: 'transparent'
                          }}
                        >
                          {getAccountTypeIcon(caseItem.accountType)}
                        </Avatar>
                        {caseItem.accountType}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${caseItem.totalAmount.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Principal: ${caseItem.principalAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getCaseStatusChip(caseItem.status)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {caseItem.overdueDocuments > 0 ? (
                          <Badge 
                            badgeContent={caseItem.overdueDocuments} 
                            color="error"
                            max={99}
                            sx={{ mr: 1 }}
                          >
                            <DescriptionIcon />
                          </Badge>
                        ) : (
                          <DescriptionIcon sx={{ mr: 1 }} />
                        )}
                        {caseItem.documentCount}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, caseItem)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Recent Documents Tab */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Case</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentDocuments.filter(document => 
                  document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  document.case.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((document) => (
                  <TableRow 
                    key={document.id}
                    hover
                    onClick={() => handleDocumentClick(document.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: 
                              document.status === 'processed' ? theme.palette.success.light :
                              document.status === 'error' ? theme.palette.error.light :
                              theme.palette.grey[300]
                          }}
                        >
                          <InsertDriveFileIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {document.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>{document.case}</TableCell>
                    <TableCell>{document.uploaded}</TableCell>
                    <TableCell>
                      {getDocumentStatusChip(document.status, document.confidence)}
                    </TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, document)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Alert for no search results */}
        {((tabValue === 0 && recentCases.filter(caseItem => 
            caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.debtorName.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0) ||
          (tabValue === 1 && recentDocuments.filter(document => 
            document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            document.case.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0)) && searchTerm && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              No results found for "{searchTerm}"
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </Box>
        )}
      </Card>
      
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          if (tabValue === 0) {
            handleCaseClick(selectedItem?.id);
          } else {
            handleDocumentClick(selectedItem?.id);
          }
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        
        {tabValue === 1 && selectedItem?.status === 'error' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Retry Processing</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Recent Activity Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader 
                title="Document Processing Activity" 
                titleTypographyProps={{ variant: 'subtitle1' }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ width: '100%', p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <Chip label="Just now" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                        <CheckCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Smith_CreditCard_CollectionLetter.pdf processed successfully"
                      secondary="OCR completed with 92.5% confidence"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="10 mins ago" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        <CloudUploadIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brown_StudentLoan_Deferment.pdf uploaded"
                      secondary="Queued for processing"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="25 mins ago" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Davis_Mortgage_Statement.pdf processing failed"
                      secondary="Error: Poor image quality. Needs manual review."
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="1 hour ago" size="small" variant="outlined" />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Williams_AutoLoan_Agreement.pdf classified"
                      secondary="Document type: Credit Agreement (88.3% confidence)"
                    />
                  </ListItem>
                </List>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1.5 }}>
                <Button
                  fullWidth
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Activity
                </Button>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader 
                title="Case Updates" 
                titleTypographyProps={{ variant: 'subtitle1' }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ width: '100%', p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <Chip label="Today" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                        <GavelIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Davis Mortgage Default moved to legal proceedings"
                      secondary="Court filing scheduled for next week"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="Today" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New debtor information added to Johnson Medical Debt"
                      secondary="Updated contact details and payment capacity"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="Yesterday" size="small" variant="outlined" />
                    }
                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                        <AttachMoneyIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Payment received for Smith Credit Card Debt"
                      secondary="$250.00 payment applied to principal"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip label="Yesterday" size="small" variant="outlined" />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New case created: Brown Student Loan"
                      secondary="Assigned to Education Recovery team"
                    />
                  </ListItem>
                </List>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1.5 }}>
                <Button
                  fullWidth
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Updates
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* System Status */}
      <Box sx={{ mb: 4 }}>
        <Alert 
          severity="info" 
          variant="outlined"
          action={
            <Button color="inherit" size="small">
              System Status
            </Button>
          }
        >
          <AlertTitle>OCR System Status: Operational</AlertTitle>
          All document processing systems are functioning normally. Current processing time: ~2 minutes per document.
        </Alert>
      </Box>
    </Box>
  );
}

export default DebtCollectionDashboard;