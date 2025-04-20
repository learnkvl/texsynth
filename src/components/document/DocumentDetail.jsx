// src/components/document/DocumentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { AlertTitle } from '@mui/material';

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
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  Badge,
  Avatar,
  Alert,
  LinearProgress,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import HistoryIcon from '@mui/icons-material/History';
import FolderIcon from '@mui/icons-material/Folder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GavelIcon from '@mui/icons-material/Gavel';

// Document viewer styled component
const DocumentViewerContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 300px)',
  minHeight: 400,
  width: '100%',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  position: 'relative'
}));

// Mock document data
const mockDocument = {
  id: 'doc-001',
  name: 'Smith_CreditCard_Statement_Feb2025.pdf',
  case: 'Smith Credit Card Debt',
  caseId: 'case-001',
  type: 'Account Statement',
  category: 'Credit Card',
  uploaded: '2025-04-10T10:15:00Z',
  status: 'processed',
  confidence: 92.5,
  size: '1.2 MB',
  format: 'pdf',
  uploadedBy: 'John Doe',
  path: '/documents/cases/smith-cc/statements/',
  processingDate: '2025-04-10T10:20:00Z',
  lastViewed: '2025-04-15T14:30:00Z',
  description: 'Credit card statement showing transactions and current balance for account ending in 4567. Statement period: January 1-31, 2025.',
  tags: ['statement', 'credit card', 'smith', 'february 2025'],
  metadata: {
    pages: 3,
    author: 'BankCard Services',
    creator: 'PDF Creator 2.0',
    created: '2025-02-01T00:00:00Z'
  },
  extractedData: {
    entities: [
      { id: 1, type: 'account_number', text: '****-****-****-4567', confidence: 98.5 },
      { id: 2, type: 'entity_name', text: 'John Smith', confidence: 97.2 },
      { id: 3, type: 'date', text: 'February 1, 2025', confidence: 96.1, subtype: 'statement_date' },
      { id: 4, type: 'date', text: 'February 25, 2025', confidence: 95.8, subtype: 'due_date' },
      { id: 5, type: 'amount', text: '$2,450.75', confidence: 99.1, subtype: 'current_balance' },
      { id: 6, type: 'amount', text: '$275.00', confidence: 98.4, subtype: 'minimum_payment' },
      { id: 7, type: 'amount', text: '$35.00', confidence: 97.9, subtype: 'late_fee' },
      { id: 8, type: 'amount', text: '$1,950.75', confidence: 98.2, subtype: 'previous_balance' },
      { id: 9, type: 'amount', text: '$500.00', confidence: 99.0, subtype: 'last_payment' },
      { id: 10, type: 'entity_name', text: 'BankCard Services', confidence: 96.5, subtype: 'creditor' }
    ],
    tables: [
      {
        id: 1,
        name: 'Transactions',
        columns: ['Date', 'Description', 'Amount'],
        rows: [
          ['01/02/2025', 'Grocery Store #123', '$85.43'],
          ['01/05/2025', 'Gas Station', '$45.29'],
          ['01/08/2025', 'Online Retailer', '$129.99'],
          ['01/12/2025', 'Restaurant', '$64.75'],
          ['01/15/2025', 'Department Store', '$189.95'],
          ['01/18/2025', 'Utility Payment', '$112.50'],
          ['01/22/2025', 'Medical Services', '$250.00'],
          ['01/25/2025', 'Subscription Service', '$15.99'],
          ['01/28/2025', 'Payment - Thank You', '-$500.00'],
          ['01/30/2025', 'Late Fee', '$35.00']
        ],
        confidence: 94.7
      }
    ]
  },
  processingHistory: [
    { action: 'Uploaded', timestamp: '2025-04-10T10:15:00Z', user: 'John Doe' },
    { action: 'Queued for processing', timestamp: '2025-04-10T10:16:00Z', system: true },
    { action: 'OCR processing started', timestamp: '2025-04-10T10:17:00Z', system: true },
    { action: 'OCR processing completed', timestamp: '2025-04-10T10:19:00Z', system: true, details: 'Confidence: 92.5%' },
    { action: 'Classified as Account Statement', timestamp: '2025-04-10T10:19:30Z', system: true, details: 'Confidence: 94.8%' },
    { action: 'Data extraction completed', timestamp: '2025-04-10T10:20:00Z', system: true },
    { action: 'Tagged automatically', timestamp: '2025-04-10T10:20:30Z', system: true },
    { action: 'Viewed', timestamp: '2025-04-12T15:45:00Z', user: 'Sarah Adams' },
    { action: 'Edited metadata', timestamp: '2025-04-14T11:20:00Z', user: 'Michael Johnson' },
    { action: 'Viewed', timestamp: '2025-04-15T14:30:00Z', user: 'John Doe' }
  ]
};

// Helper function to get format icon
const getFormatIcon = (format) => {
  switch(format.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdfIcon />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'tiff':
      return <ImageIcon />;
    case 'xlsx':
    case 'docx':
    case 'doc':
      return <DescriptionIcon />;
    default:
      return <InsertDriveFileIcon />;
  }
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  switch(category) {
    case 'Credit Card':
      return <CreditCardIcon />;
    case 'Medical':
      return <MedicalInformationIcon />;
    case 'Auto Loan':
      return <ReceiptLongIcon />;
    case 'Mortgage':
      return <HomeIcon />;
    case 'Student Loan':
      return <SchoolIcon />;
    default:
      return <DescriptionIcon />;
  }
};

// Helper function to get status chip
const getStatusChip = (status, confidence) => {
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
          icon={<HourglassEmptyIcon />} 
          label="Pending" 
          color="default" 
          size="small" 
        />
      );
    case 'error':
      return (
        <Chip 
          icon={<ErrorIcon />} 
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

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Fetch document data
  useEffect(() => {
    // In a real app, you would fetch document data from API
    // For this demo, we'll use mock data
    setTimeout(() => {
      setDocument(mockDocument);
      setLoading(false);
    }, 500);
  }, [documentId]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle back to documents
  const handleBackToDocuments = () => {
    navigate('/documents');
  };
  
  // Handle download document
  const handleDownload = () => {
    console.log('Downloading document:', documentId);
    handleMenuClose();
    // In a real app, this would trigger a download
  };
  
  // Handle delete document
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Confirm delete document
  const confirmDelete = () => {
    console.log('Deleting document:', documentId);
    setDeleteDialogOpen(false);
    // In a real app, this would delete the document and redirect
    navigate('/documents');
  };
  
  // Handle process document
  const handleProcessDocument = () => {
    navigate(`/documents/${documentId}/process`);
  };
  
  // Handle create invoice
  const handleCreateInvoice = () => {
    navigate('/invoices/create');
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading document...</Typography>
      </Box>
    );
  }
  
  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Document not found: {documentId}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDocuments}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          component={RouterLink} 
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          component={RouterLink} 
          to="/documents"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DescriptionIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Documents
        </Link>
        <Typography color="text.primary">
          {document.name}
        </Typography>
      </Breadcrumbs>
      
      {/* Document Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                bgcolor: 
                  document.status === 'processed' ? alpha(theme.palette.success.main, 0.1) :
                  document.status === 'error' ? alpha(theme.palette.error.main, 0.1) :
                  document.status === 'processing' ? alpha(theme.palette.primary.main, 0.1) :
                  alpha(theme.palette.grey[500], 0.1)
              }}
            >
              {React.cloneElement(getFormatIcon(document.format), { 
                fontSize: 'medium',
                color: 
                  document.status === 'processed' ? 'success' :
                  document.status === 'error' ? 'error' :
                  document.status === 'processing' ? 'primary' : 
                  'action'
              })}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {document.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FolderIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Link 
                    component={RouterLink} 
                    to={`/cases/${document.caseId}`}
                    underline="hover"
                  >
                    {document.case}
                  </Link>
                </Box>
                <Divider orientation="vertical" flexItem />
                {getStatusChip(document.status, document.confidence)}
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(getCategoryIcon(document.category), { 
                    fontSize: 'small', 
                    sx: { mr: 0.5 }
                  })}
                  <Typography variant="body2">{document.type}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">
                  {document.size}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDocuments}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            
            {document.status === 'pending' || document.status === 'error' ? (
              <Button
                variant="contained"
                startIcon={<DocumentScannerIcon />}
                onClick={handleProcessDocument}
                sx={{ mr: 1 }}
              >
                Process Document
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<ReceiptIcon />}
                onClick={handleCreateInvoice}
                sx={{ mr: 1 }}
              >
                Generate Invoice
              </Button>
            )}
            
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      {/* Document Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Preview" />
          <Tab label="Extracted Data" />
          <Tab label="Metadata" />
          <Tab label="History" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box sx={{ mb: 3 }}>
        {/* Preview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <DocumentViewerContainer>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Document Preview
                  </Typography>
                  <img 
                    src="/api/placeholder/600/800" 
                    alt="Document preview placeholder" 
                    style={{ maxWidth: '100%', maxHeight: '95%', objectFit: 'contain' }}
                  />
                </Box>
              </DocumentViewerContainer>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardHeader 
                  title="Document Information" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <DescriptionIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Document Type" 
                        secondary={document.type}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocalOfferIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Category" 
                        secondary={document.category}
                      />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Uploaded By" 
                        secondary={document.uploadedBy}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CalendarTodayIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Upload Date" 
                        secondary={formatDate(document.uploaded)}
                      />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <DataObjectIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="OCR Confidence" 
                        secondary={`${document.confidence.toFixed(1)}%`}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Last Viewed" 
                        secondary={formatDate(document.lastViewed)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              
              <Card variant="outlined">
                <CardHeader 
                  title="Description" 
                  titleTypographyProps={{ variant: 'h6' }}
                  action={
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2">
                    {document.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {document.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Extracted Data Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader 
                  title="Extracted Entities" 
                  titleTypographyProps={{ variant: 'h6' }}
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                      <AutoAwesomeIcon />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  {document.extractedData.entities.map((entity) => (
                    <Box 
                      key={entity.id}
                      sx={{ 
                        mb: 2, 
                        p: 1.5, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                        backgroundColor: 'background.paper' 
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={entity.type.replace('_', ' ')}
                          size="small"
                          color={
                            entity.type === 'account_number' ? 'primary' :
                            entity.type === 'amount' ? 'success' :
                            entity.type === 'date' ? 'secondary' :
                            'default'
                          }
                        />
                        <Chip 
                          label={`${entity.confidence.toFixed(1)}%`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="body1" fontWeight="medium">
                        {entity.text}
                      </Typography>
                      
                      {entity.subtype && (
                        <Typography variant="caption" color="text.secondary">
                          Subtype: {entity.subtype.replace('_', ' ')}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {document.extractedData.tables.map((table) => (
                <Card variant="outlined" key={table.id} sx={{ mb: 3 }}>
                  <CardHeader 
                    title={`Table: ${table.name}`}
                    titleTypographyProps={{ variant: 'h6' }}
                    subheader={`Confidence: ${table.confidence.toFixed(1)}%`}
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        <AutoAwesomeIcon />
                      </Avatar>
                    }
                  />
                  <Divider />
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {table.columns.map((column, index) => (
                            <TableCell key={index}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {table.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {cell.includes('-') ? (
                                    <Typography color="success.main">{cell}</Typography>
                                ) : cell.startsWith(')') ? (
                                    <Typography color={cell.includes('Fee') ? 'error.main' : 'inherit'}>
                                        {cell}
                                    </Typography>
                                ) : (
                                    cell
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ))}
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Suggested Actions</AlertTitle>
                Based on the extracted data, this document appears to be a credit card statement with payment history and a current balance. You can:
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <li>Create an invoice for the current balance amount</li>
                  <li>Add the payment history to the case record</li>
                  <li>Update the account balance in the system</li>
                </Box>
              </Alert>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<ReceiptIcon />}
                  onClick={handleCreateInvoice}
                >
                  Generate Invoice
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
        
        {/* Metadata Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader 
                  title="File Metadata"
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="File Name" 
                        secondary={document.name}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="File Format" 
                        secondary={document.format.toUpperCase()}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="File Size" 
                        secondary={document.size}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="File Path" 
                        secondary={document.path}
                      />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Pages" 
                        secondary={document.metadata.pages}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Author" 
                        secondary={document.metadata.author}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Creator" 
                        secondary={document.metadata.creator}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Creation Date" 
                        secondary={formatDate(document.metadata.created)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardHeader 
                  title="System Information"
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <Divider />
                <CardContent>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Document ID" 
                        secondary={document.id}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Upload Date" 
                        secondary={formatDate(document.uploaded)}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Uploaded By" 
                        secondary={document.uploadedBy}
                      />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Processing Date" 
                        secondary={formatDate(document.processingDate)}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Processing Status" 
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getStatusChip(document.status, document.confidence)}
                          </Box>
                        }
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="OCR Confidence" 
                        secondary={`${document.confidence.toFixed(1)}%`}
                      />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Last Viewed" 
                        secondary={formatDate(document.lastViewed)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownload}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
        
        {/* History Tab */}
        {tabValue === 3 && (
          <Card variant="outlined">
            <CardHeader 
              title="Processing History"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <HistoryIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List disablePadding>
                {document.processingHistory.map((historyItem, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderBottom: index < document.processingHistory.length - 1 ? 1 : 0, 
                      borderColor: 'divider' 
                    }}
                  >
                    <ListItemIcon>
                      {historyItem.action.includes('Uploaded') && <CloudUploadIcon color="primary" />}
                      {historyItem.action.includes('Queued') && <HourglassEmptyIcon color="action" />}
                      {historyItem.action.includes('started') && <HourglassEmptyIcon color="primary" />}
                      {historyItem.action.includes('completed') && <CheckCircleIcon color="success" />}
                      {historyItem.action.includes('Classified') && <AutoAwesomeIcon color="secondary" />}
                      {historyItem.action.includes('extraction') && <DataObjectIcon color="success" />}
                      {historyItem.action.includes('Tagged') && <LocalOfferIcon color="info" />}
                      {historyItem.action.includes('Viewed') && <VisibilityIcon color="action" />}
                      {historyItem.action.includes('Edited') && <EditIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={historyItem.action}
                      secondary={
                        <>
                          {formatDate(historyItem.timestamp)}
                          {historyItem.user && ` • ${historyItem.user}`}
                          {historyItem.details && ` • ${historyItem.details}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* More Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Path</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Metadata</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DocumentDetail;