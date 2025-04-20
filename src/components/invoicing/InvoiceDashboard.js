// src/components/invoicing/InvoiceDashboard.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

// **New Imports**:
import DescriptionIcon from '@mui/icons-material/Description'; // For Invoice Formats
import CloudUploadIcon from '@mui/icons-material/CloudUpload';  // For Upload Documents

// Mock data for invoices
const mockInvoices = [
  { 
    id: 1001, 
    invoiceNumber: 'INV-20250101', 
    client: 'Johnson & Partners LLP', 
    matter: 'Big Bank Inc. Collections', 
    date: '2025-01-01', 
    dueDate: '2025-01-31', 
    amount: 2500.00, 
    status: 'paid', 
    paymentDate: '2025-01-20' 
  },
  { 
    id: 1002, 
    invoiceNumber: 'INV-20250115', 
    client: 'Smith Collections Agency', 
    matter: 'Medical Center Corp. Recovery', 
    date: '2025-01-15', 
    dueDate: '2025-02-14', 
    amount: 1750.50, 
    status: 'sent' 
  },
  { 
    id: 1003, 
    invoiceNumber: 'INV-20250120', 
    client: 'Adams Credit Recovery', 
    matter: 'Multiple Accounts Package', 
    date: '2025-01-20', 
    dueDate: '2025-02-19', 
    amount: 3250.25, 
    status: 'draft' 
  },
  { 
    id: 1004, 
    invoiceNumber: 'INV-20250105', 
    client: 'Johnson & Partners LLP', 
    matter: 'Utility Co. Default Accounts', 
    date: '2025-01-05', 
    dueDate: '2025-02-04', 
    amount: 1200.00, 
    status: 'overdue' 
  },
  { 
    id: 1005, 
    invoiceNumber: 'INV-20241215', 
    client: 'Smith Collections Agency', 
    matter: 'Credit Card Recovery', 
    date: '2024-12-15', 
    dueDate: '2025-01-14', 
    amount: 950.75, 
    status: 'paid', 
    paymentDate: '2025-01-10' 
  },
  { 
    id: 1006, 
    invoiceNumber: 'INV-20241201', 
    client: 'Adams Credit Recovery', 
    matter: 'Bankruptcy Processing', 
    date: '2024-12-01', 
    dueDate: '2024-12-31', 
    amount: 4500.00, 
    status: 'overdue' 
  },
  { 
    id: 1007, 
    invoiceNumber: 'INV-20250125', 
    client: 'Johnson & Partners LLP', 
    matter: 'Legal Filing Services', 
    date: '2025-01-25', 
    dueDate: '2025-02-24', 
    amount: 750.25, 
    status: 'draft' 
  }
];

// Status chip style configuration
const getStatusConfig = (status) => {
  switch (status) {
    case 'draft':
      return { 
        color: 'default', 
        label: 'Draft', 
        icon: <EditIcon fontSize="small" /> 
      };
    case 'sent':
      return { 
        color: 'primary', 
        label: 'Sent', 
        icon: <SendIcon fontSize="small" /> 
      };
    case 'overdue':
      return { 
        color: 'error', 
        label: 'Overdue', 
        icon: <WarningIcon fontSize="small" /> 
      };
    case 'paid':
      return { 
        color: 'success', 
        label: 'Paid', 
        icon: <CheckCircleIcon fontSize="small" /> 
      };
    default:
      return { 
        color: 'default', 
        label: status, 
        icon: <InfoIcon fontSize="small" /> 
      };
  }
};

// Styled component for stats cards
const StatsCard = styled(Card)(({ theme, colortype }) => ({
  borderTop: `4px solid ${
    colortype === 'primary' ? theme.palette.primary.main :
    colortype === 'success' ? theme.palette.success.main :
    colortype === 'warning' ? theme.palette.warning.main :
    colortype === 'error' ? theme.palette.error.main :
    theme.palette.divider
  }`,
  height: '100%',
}));

function InvoiceDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // **State for Invoice Format selection dialog**
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  // **State for Upload Documents dialog**
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Function to filter invoices
  const filterInvoices = () => {
    let filtered = [...mockInvoices];
    
    // Apply tab filter
    if (filterTab === 1) { // Draft
      filtered = filtered.filter(inv => inv.status === 'draft');
    } else if (filterTab === 2) { // Sent
      filtered = filtered.filter(inv => inv.status === 'sent');
    } else if (filterTab === 3) { // Overdue
      filtered = filtered.filter(inv => inv.status === 'overdue');
    } else if (filterTab === 4) { // Paid
      filtered = filtered.filter(inv => inv.status === 'paid');
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(term) ||
        inv.client.toLowerCase().includes(term) ||
        inv.matter.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredInvoices = filterInvoices();

  // Calculate summary statistics
  const totalPaid = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const totalOutstanding = mockInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const totalOverdue = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const totalDraft = mockInvoices
    .filter(inv => inv.status === 'draft')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setFilterTab(newValue);
  };
  
  // Handle menu open
  const handleMenuOpen = (event, invoice) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle create new invoice
  const handleCreateInvoice = () => {
    navigate('/invoices/create');
  };
  
  // Handle view invoice
  const handleViewInvoice = (id) => {
    navigate(`/invoices/${id}`);
  };
  
  // Handle edit invoice
  const handleEditInvoice = (id) => {
    navigate(`/invoices/${id}/edit`);
    handleMenuClose();
  };
  
  // Toggle filters
  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  // **Open/Close Invoice Format dialog**
  const handleOpenFormatDialog = () => {
    setFormatDialogOpen(true);
  };
  const handleCloseFormatDialog = () => {
    setFormatDialogOpen(false);
  };
  
  // **Open/Close Upload Documents dialog**
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  // **Handle choosing a preexisting format**
  const handleChooseFormat = (formatName) => {
    console.log(`Chosen format: ${formatName}`);
    // TODO: set up the invoice format in your form or state
    setFormatDialogOpen(false);
  };

  // **Handle AI-based generation** (stub)
  const handleGenerateFormatUsingAI = () => {
    console.log("AI-based invoice format generation triggered...");
    // TODO: call your AI service / endpoint
    setFormatDialogOpen(false);
  };

  // **Handle file upload** (stub)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploading file: ", file);
    // TODO: handle the upload logic (to your server or a storage service)
    setUploadDialogOpen(false);
  };

  return (
    <Box>
      {/* Header Row */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <Typography variant="h4">Invoices</Typography>

        {/* Right-side buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>

          {/* Invoice Formats Button */}
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={handleOpenFormatDialog}
          >
            Invoice Format
          </Button>

          {/* Upload Documents Button */}
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenUploadDialog}
          >
            Upload Documents
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard colortype="success">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Typography variant="h6">Paid</Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${totalPaid.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoices.filter(inv => inv.status === 'paid').length} invoices
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard colortype="primary">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <HourglassEmptyIcon />
                </Avatar>
                <Typography variant="h6">Outstanding</Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${totalOutstanding.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoices.filter(inv => inv.status === 'sent').length} invoices
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard colortype="error">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Typography variant="h6">Overdue</Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${totalOverdue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoices.filter(inv => inv.status === 'overdue').length} invoices
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard colortype="warning">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <EditIcon />
                </Avatar>
                <Typography variant="h6">Drafts</Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${totalDraft.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockInvoices.filter(inv => inv.status === 'draft').length} invoices
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search invoices by number, client, or matter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                      aria-label="clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={toggleFilters}
              sx={{ ml: 'auto' }}
            >
              {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        </Grid>
        
        {filtersExpanded && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Client"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Date From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Date To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Amount Range"
                  select
                  size="small"
                  defaultValue=""
                >
                  <MenuItem value="">Any Amount</MenuItem>
                  <MenuItem value="0-500">$0 - $500</MenuItem>
                  <MenuItem value="500-1000">$500 - $1,000</MenuItem>
                  <MenuItem value="1000-5000">$1,000 - $5,000</MenuItem>
                  <MenuItem value="5000+">$5,000+</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs 
            value={filterTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                All
                <Chip 
                  label={mockInvoices.length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Drafts
                <Chip 
                  label={mockInvoices.filter(inv => inv.status === 'draft').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Sent
                <Chip 
                  label={mockInvoices.filter(inv => inv.status === 'sent').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={mockInvoices.filter(inv => inv.status === 'overdue').length} color="error">
                  Overdue
                </Badge>
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Paid
                <Chip 
                  label={mockInvoices.filter(inv => inv.status === 'paid').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
          </Tabs>
        </Box>
      </Paper>
      
      {/* Invoices Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Matter</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  const { color, label, icon } = getStatusConfig(invoice.status);
                  const isOverdue = invoice.status === 'overdue';
                  
                  return (
                    <TableRow 
                      key={invoice.id}
                      hover
                      onClick={() => handleViewInvoice(invoice.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Badge 
                            color={isOverdue ? "error" : "default"}
                            variant={isOverdue ? "dot" : "standard"}
                            invisible={!isOverdue}
                          >
                            <Avatar 
                              sx={{ 
                                width: 28, 
                                height: 28, 
                                mr: 1,
                                bgcolor: invoice.status === 'draft' ? 'warning.light' : 
                                         invoice.status === 'sent' ? 'primary.light' : 
                                         invoice.status === 'overdue' ? 'error.light' : 
                                         'success.light'
                              }}
                            >
                              {invoice.status === 'draft' ? <EditIcon fontSize="small" /> : 
                               invoice.status === 'sent' ? <SendIcon fontSize="small" /> : 
                               invoice.status === 'overdue' ? <WarningIcon fontSize="small" /> : 
                               <CheckCircleIcon fontSize="small" />}
                            </Avatar>
                          </Badge>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {invoice.invoiceNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.matter}</TableCell>
                      <TableCell>{format(parseISO(invoice.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {format(parseISO(invoice.dueDate), 'MMM d, yyyy')}
                          {isOverdue && (
                            <Tooltip title="This invoice is past due">
                              <WarningIcon 
                                fontSize="small" 
                                color="error" 
                                sx={{ ml: 1, fontSize: 16 }} 
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          sx={{ 
                            fontWeight: 500,
                            color: invoice.amount > 1000 ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          ${invoice.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={label}
                          color={color}
                          icon={icon}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuOpen(event, invoice)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No invoices found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm 
                          ? "Try adjusting your search criteria"
                          : filterTab !== 0 
                            ? "No invoices in this category"
                            : "Create your first invoice to get started"
                        }
                      </Typography>
                      {!searchTerm && filterTab === 0 && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateInvoice}
                          sx={{ mt: 2 }}
                        >
                          Create Invoice
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewInvoice(selectedInvoice?.id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        
        {selectedInvoice?.status === 'draft' && (
          <MenuItem onClick={() => handleEditInvoice(selectedInvoice?.id)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        
        {selectedInvoice?.status === 'draft' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Send</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/** DIALOG: Select Invoice Format **/}
      <Dialog open={formatDialogOpen} onClose={handleCloseFormatDialog} fullWidth maxWidth="xs">
        <DialogTitle>Select or Generate Invoice Format</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Preexisting Formats
          </Typography>
          <MenuItem onClick={() => handleChooseFormat('Basic Template')}>Basic Template</MenuItem>
          <MenuItem onClick={() => handleChooseFormat('Minimal Template')}>Minimal Template</MenuItem>
          <MenuItem onClick={() => handleChooseFormat('Professional Template')}>Professional Template</MenuItem>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Use AI to Generate
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Provide a sample invoice or let the system generate a recommended format.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerateFormatUsingAI}
          >
            Generate via AI
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormatDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/** DIALOG: Upload Documents **/}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} fullWidth maxWidth="xs">
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" mb={2}>
            Attach supporting documents for your invoice (PDF, Word, or image files).
          </Typography>
          <Button variant="outlined" component="label">
            Choose File
            <input 
              hidden 
              accept=".pdf,.doc,.docx,.jpg,.png" 
              type="file" 
              onChange={handleFileUpload} 
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InvoiceDashboard;
