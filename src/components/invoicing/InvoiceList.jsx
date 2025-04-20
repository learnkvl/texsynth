// src/components/invoicing/InvoiceList.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Popover,
  Grid,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';
import { format, parseISO } from 'date-fns';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


// Chart components for statistics popup
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningIcon from '@mui/icons-material/Warning';
import TimerIcon from '@mui/icons-material/Timer';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BarChartIcon from '@mui/icons-material/BarChart';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock invoice data
const mockInvoices = [
  {
    id: 'INV-20250101',
    client: 'Johnson & Partners LLP',
    clientId: 1,
    matter: 'Big Bank Collections',
    amount: 2500.00,
    dueDate: '2025-02-01',
    issueDate: '2025-01-01',
    status: 'paid',
    paymentDate: '2025-01-20',
    debtorName: 'Jane Doe',
    accountNumber: 'ACC-12345-789',
    templateType: 'Collection Services'
  },
  {
    id: 'INV-20250110',
    client: 'Smith Collections Agency',
    clientId: 2,
    matter: 'Medical Debt Recovery',
    amount: 1750.50,
    dueDate: '2025-02-10',
    issueDate: '2025-01-10',
    status: 'sent',
    paymentDate: null,
    debtorName: 'John Smith',
    accountNumber: 'ACC-98765-432',
    templateType: 'Medical Debt'
  },
  {
    id: 'INV-20250115',
    client: 'Adams Credit Recovery',
    clientId: 3,
    matter: 'Credit Card Default',
    amount: 3200.75,
    dueDate: '2025-02-15',
    issueDate: '2025-01-15',
    status: 'draft',
    paymentDate: null,
    debtorName: 'Robert Johnson',
    accountNumber: 'ACC-45678-123',
    templateType: 'Standard Legal'
  },
  {
    id: 'INV-20250120',
    client: 'Johnson & Partners LLP',
    clientId: 1,
    matter: 'Auto Loan Default',
    amount: 5400.25,
    dueDate: '2025-02-20',
    issueDate: '2025-01-20',
    status: 'overdue',
    paymentDate: null,
    debtorName: 'Mary Williams',
    accountNumber: 'ACC-56789-012',
    templateType: 'Auto Loan'
  },
  {
    id: 'INV-20250125',
    client: 'Smith Collections Agency',
    clientId: 2,
    matter: 'Personal Loan Collections',
    amount: 1200.00,
    dueDate: '2025-02-25',
    issueDate: '2025-01-25',
    status: 'paid',
    paymentDate: '2025-02-10',
    debtorName: 'James Thompson',
    accountNumber: 'ACC-34567-890',
    templateType: 'Standard Legal'
  },
  {
    id: 'INV-20250130',
    client: 'Adams Credit Recovery',
    clientId: 3,
    matter: 'Student Loan Default',
    amount: 4750.50,
    dueDate: '2025-03-01',
    issueDate: '2025-01-30',
    status: 'sent',
    paymentDate: null,
    debtorName: 'Lisa Davis',
    accountNumber: 'ACC-87654-321',
    templateType: 'Standard Legal'
  },
  {
    id: 'INV-20250205',
    client: 'Johnson & Partners LLP',
    clientId: 1,
    matter: 'Mortgage Default',
    amount: 12500.75,
    dueDate: '2025-03-05',
    issueDate: '2025-02-05',
    status: 'sent',
    paymentDate: null,
    debtorName: 'David Brown',
    accountNumber: 'ACC-23456-789',
    templateType: 'Mortgage'
  },
  {
    id: 'INV-20250210',
    client: 'Smith Collections Agency',
    clientId: 2,
    matter: 'Utility Bill Collections',
    amount: 850.25,
    dueDate: '2025-03-10',
    issueDate: '2025-02-10',
    status: 'draft',
    paymentDate: null,
    debtorName: 'Sarah Wilson',
    accountNumber: 'ACC-76543-210',
    templateType: 'Standard Legal'
  },
  {
    id: 'INV-20250215',
    client: 'Adams Credit Recovery',
    clientId: 3,
    matter: 'Credit Card Default',
    amount: 3100.00,
    dueDate: '2025-03-15',
    issueDate: '2025-02-15',
    status: 'overdue',
    paymentDate: null,
    debtorName: 'Michael Jones',
    accountNumber: 'ACC-65432-109',
    templateType: 'Collection Services'
  },
  {
    id: 'INV-20250220',
    client: 'Johnson & Partners LLP',
    clientId: 1,
    matter: 'Retail Debt Collections',
    amount: 975.50,
    dueDate: '2025-03-20',
    issueDate: '2025-02-20',
    status: 'sent',
    paymentDate: null,
    debtorName: 'Thomas Miller',
    accountNumber: 'ACC-54321-098',
    templateType: 'Standard Legal'
  }
];

// Mock statistics data
const mockStatistics = {
  invoicesByType: [
    { name: 'Standard Legal', value: 5 },
    { name: 'Collection Services', value: 2 },
    { name: 'Medical Debt', value: 1 },
    { name: 'Auto Loan', value: 1 },
    { name: 'Mortgage', value: 1 },
  ],
  invoicesByStatus: [
    { name: 'Paid', value: 2 },
    { name: 'Sent', value: 4 },
    { name: 'Draft', value: 2 },
    { name: 'Overdue', value: 2 },
  ],
  monthlyInvoices: [
    { month: 'Jan', amount: 18802 },
    { month: 'Feb', amount: 21426.5 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
  ],
  totalInvoiced: 40228.5,
  totalPaid: 3700,
  averageInvoiceAmount: 4022.85,
  invoiceCount: 10,
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helper function to get status chip
const getStatusChip = (status) => {
  switch (status) {
    case 'paid':
      return (
        <Chip 
          icon={<CheckCircleIcon />} 
          label="Paid" 
          color="success" 
          size="small" 
        />
      );
    case 'sent':
      return (
        <Chip 
          icon={<SendIcon />} 
          label="Sent" 
          color="primary" 
          size="small" 
        />
      );
    case 'draft':
      return (
        <Chip 
          icon={<EditIcon />} 
          label="Draft" 
          color="default" 
          size="small" 
        />
      );
    case 'overdue':
      return (
        <Chip 
          icon={<WarningIcon />} 
          label="Overdue" 
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

function InvoiceList() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('issueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    amountBetween: ''
  });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statsAnchorEl, setStatsAnchorEl] = useState(null);
  const [activeStatTab, setActiveStatTab] = useState(0);
  
  // Get list of clients from mock data
  const clients = [...new Set(mockInvoices.map(inv => inv.client))];
  
  // Handle row click
  const handleRowClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };
  
  // Handle create invoice
  const handleCreateInvoice = () => {
    navigate('/invoices/create');
  };
  
  // Handle upload invoice
  const handleUploadInvoice = () => {
    navigate('/invoices/upload');
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
  
  // Handle invoice edit
  const handleEditInvoice = () => {
    if (selectedInvoice) {
      navigate(`/invoices/edit/${selectedInvoice.id}`);
    }
    handleMenuClose();
  };
  
  // Handle invoice delete
  const handleDeleteInvoice = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = () => {
    // In a real app, delete the invoice
    console.log('Deleting invoice:', selectedInvoice?.id);
    setDeleteDialogOpen(false);
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };
  
  // Handle stats click
  const handleStatsClick = (event) => {
    setStatsAnchorEl(event.currentTarget);
  };
  
  // Handle stats close
  const handleStatsClose = () => {
    setStatsAnchorEl(null);
  };
  
  // Handle stat tab change
  const handleStatTabChange = (event, newValue) => {
    setActiveStatTab(newValue);
  };
  
  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Toggle filters expanded
  const toggleFiltersExpanded = () => {
    setFiltersExpanded(!filtersExpanded);
  };
  
  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      client: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountBetween: ''
    });
    setSearchTerm('');
  };
  
  // Handle sort request
  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter and sort invoices
  const filteredInvoices = mockInvoices.filter(invoice => {
    // Search term filter
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.matter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.debtorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Client filter
    const matchesClient = !filters.client || invoice.client === filters.client;
    
    // Status filter
    const matchesStatus = !filters.status || invoice.status === filters.status;
    
    // Date range filter
    const matchesDateFrom = !filters.dateFrom || new Date(invoice.issueDate) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(invoice.issueDate) <= new Date(filters.dateTo);
    
    // Amount between filter
    let matchesAmount = true;
    if (filters.amountBetween) {
      const [min, max] = filters.amountBetween.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        matchesAmount = invoice.amount >= min && invoice.amount <= max;
      }
    }
    
    return matchesSearch && 
           matchesClient && 
           matchesStatus && 
           matchesDateFrom && 
           matchesDateTo && 
           matchesAmount;
  }).sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (order === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });
  
  // Get paginated invoices
  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Header cells for table
  const headCells = [
    { id: 'id', label: 'Invoice #', sortable: true },
    { id: 'client', label: 'Client', sortable: true },
    { id: 'matter', label: 'Matter', sortable: true },
    { id: 'amount', label: 'Amount', sortable: true, align: 'right' },
    { id: 'issueDate', label: 'Issue Date', sortable: true },
    { id: 'dueDate', label: 'Due Date', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false, align: 'right' }
  ];
  
  // Create sort handler for a specific column
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  return (
    <Box>
      {/* Breadcrumb Navigation */}
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
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ListIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Invoices
        </Typography>
      </Breadcrumbs>
      
      {/* Header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Invoices</Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<BarChartIcon />} 
            onClick={handleStatsClick}
            sx={{ mr: 1 }}
          >
            Analytics
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadInvoice}
            sx={{ mr: 1 }}
          >
            Upload
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>
      </Box>
      
      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search invoices by ID, client, matter, debtor..."
              value={searchTerm}
              onChange={handleSearchChange}
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
              onClick={toggleFiltersExpanded}
              sx={{ ml: 2 }}
            >
              {filtersExpanded ? 'Hide Filters' : 'Filters'}
            </Button>
          </Grid>
        </Grid>
        
        {filtersExpanded && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel id="client-filter-label">Client</InputLabel>
                  <Select
                    labelId="client-filter-label"
                    id="client-filter"
                    name="client"
                    value={filters.client}
                    onChange={handleFilterChange}
                    label="Client"
                  >
                    <MenuItem value="">All Clients</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client} value={client}>{client}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="From Date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="To Date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel>Amount Range</InputLabel>
                  <Select
                    value={filters.amountBetween}
                    onChange={handleFilterChange}
                    name="amountBetween"
                    label="Amount Range"
                  >
                    <MenuItem value="">Any Amount</MenuItem>
                    <MenuItem value="0-500">$0 - $500</MenuItem>
                    <MenuItem value="500-1000">$500 - $1,000</MenuItem>
                    <MenuItem value="1000-5000">$1,000 - $5,000</MenuItem>
                    <MenuItem value="5000-10000">$5,000 - $10,000</MenuItem>
                    <MenuItem value="10000-50000">$10,000 - $50,000</MenuItem>
                    <MenuItem value="50000+">$50,000+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* Invoice Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align || 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    hover
                    onClick={() => handleRowClick(invoice.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <ReceiptIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> */}
                        <Badge 
                            color={invoice.status === 'overdue' ? "error" : "default"}
                            variant={invoice.status === 'overdue' ? "dot" : "standard"}
                            invisible={!invoice.status === 'overdue'}
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
                        <Typography variant="body2">
                          {invoice.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.matter}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${invoice.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(invoice.issueDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(invoice.dueDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(invoice.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, invoice)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No invoices found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Object.values(filters).some(Boolean) || searchTerm
                          ? "Try adjusting your search or filters"
                          : "Create your first invoice to get started"
                        }
                      </Typography>
                      
                      {!Object.values(filters).some(Boolean) && !searchTerm && (
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
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleRowClick(selectedInvoice?.id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleEditInvoice} disabled={selectedInvoice?.status === 'paid'}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Invoice</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Invoice</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Invoice</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Invoice ID</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDeleteInvoice} disabled={selectedInvoice?.status === 'paid'}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete Invoice</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete invoice <strong>{selectedInvoice?.id}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Statistics Popover */}
      <Popover
        open={Boolean(statsAnchorEl)}
        anchorEl={statsAnchorEl}
        onClose={handleStatsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { width: 500, p: 2 }
        }}
      >
        <Typography variant="h6" gutterBottom>Invoice Analytics</Typography>
        
        <Tabs value={activeStatTab} onChange={handleStatTabChange} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="By Type" />
          <Tab label="By Month" />
        </Tabs>
        
        {activeStatTab === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Invoiced</Typography>
                  <Typography variant="h4">${mockStatistics.totalInvoiced.toLocaleString()}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Paid</Typography>
                  <Typography variant="h4">${mockStatistics.totalPaid.toLocaleString()}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Invoice Count</Typography>
                  <Typography variant="h4">{mockStatistics.invoiceCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Average Amount</Typography>
                  <Typography variant="h4">${mockStatistics.averageInvoiceAmount.toFixed(2)}</Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ height: 200, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockStatistics.invoicesByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockStatistics.invoicesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
        
        {activeStatTab === 1 && (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockStatistics.invoicesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {mockStatistics.invoicesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
        
        {activeStatTab === 2 && (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockStatistics.monthlyInvoices}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                <Legend />
                <Bar dataKey="amount" name="Invoice Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Popover>
    </Box>
  );
}

export default InvoiceList;