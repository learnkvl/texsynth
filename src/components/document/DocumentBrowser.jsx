// src/components/document/DocumentBrowser.jsx
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Avatar,
  Badge,
  useTheme,
  alpha,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter } from 'date-fns';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import FolderIcon from '@mui/icons-material/Folder';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';

// Mock data for documents
const mockDocuments = [
  {
    id: 'doc-001',
    name: 'Smith_CreditCard_Statement_Feb2025.pdf',
    case: 'Smith Credit Card Debt',
    caseId: 'case-001',
    type: 'Account Statement',
    category: 'Credit Card',
    uploaded: '2025-04-10',
    status: 'processed',
    confidence: 92.5,
    size: '1.2 MB',
    format: 'pdf',
    uploadedBy: 'John Doe',
    path: '/documents/cases/smith-cc/statements/'
  },
  {
    id: 'doc-002',
    name: 'Johnson_Medical_Bill_March2025.pdf',
    case: 'Johnson Medical Debt',
    caseId: 'case-002',
    type: 'Invoice',
    category: 'Medical',
    uploaded: '2025-04-11',
    status: 'pending',
    confidence: 0,
    size: '2.4 MB',
    format: 'pdf',
    uploadedBy: 'Sarah Adams',
    path: '/documents/cases/johnson-med/invoices/'
  },
  {
    id: 'doc-003',
    name: 'Williams_AutoLoan_Agreement.pdf',
    case: 'Williams Auto Loan',
    caseId: 'case-003',
    type: 'Credit Agreement',
    category: 'Auto Loan',
    uploaded: '2025-04-12',
    status: 'processed',
    confidence: 88.3,
    size: '3.5 MB',
    format: 'pdf',
    uploadedBy: 'John Doe',
    path: '/documents/cases/williams-auto/agreements/'
  },
  {
    id: 'doc-004',
    name: 'Davis_Mortgage_Notice_Default.pdf',
    case: 'Davis Mortgage Default',
    caseId: 'case-004',
    type: 'Default Notice',
    category: 'Mortgage',
    uploaded: '2025-04-08',
    status: 'processed',
    confidence: 95.1,
    size: '1.8 MB',
    format: 'pdf',
    uploadedBy: 'Michael Johnson',
    path: '/documents/cases/davis-mortgage/notices/'
  },
  {
    id: 'doc-005',
    name: 'Smith_CreditCard_CollectionLetter.pdf',
    case: 'Smith Credit Card Debt',
    caseId: 'case-001',
    type: 'Collection Notice',
    category: 'Credit Card',
    uploaded: '2025-04-15',
    status: 'processing',
    confidence: 0,
    size: '0.9 MB',
    format: 'pdf',
    uploadedBy: 'Sarah Adams',
    path: '/documents/cases/smith-cc/notices/'
  },
  {
    id: 'doc-006',
    name: 'Brown_StudentLoan_Deferment.pdf',
    case: 'Brown Student Loan',
    caseId: 'case-005',
    type: 'Legal Filing',
    category: 'Student Loan',
    uploaded: '2025-04-14',
    status: 'error',
    confidence: 65.2,
    size: '1.5 MB',
    format: 'pdf',
    uploadedBy: 'John Doe',
    path: '/documents/cases/brown-student/legal/'
  },
  {
    id: 'doc-007',
    name: 'Smith_CreditCard_ApplicationForm.jpg',
    case: 'Smith Credit Card Debt',
    caseId: 'case-001',
    type: 'Credit Application',
    category: 'Credit Card',
    uploaded: '2025-04-05',
    status: 'processed',
    confidence: 87.3,
    size: '1.0 MB',
    format: 'jpg',
    uploadedBy: 'Michael Johnson',
    path: '/documents/cases/smith-cc/applications/'
  },
  {
    id: 'doc-008',
    name: 'Johnson_Medical_Insurance_Claim.pdf',
    case: 'Johnson Medical Debt',
    caseId: 'case-002',
    type: 'Insurance Claim',
    category: 'Medical',
    uploaded: '2025-04-09',
    status: 'processed',
    confidence: 91.7,
    size: '2.1 MB',
    format: 'pdf',
    uploadedBy: 'Sarah Adams',
    path: '/documents/cases/johnson-med/insurance/'
  },
  {
    id: 'doc-009',
    name: 'Williams_AutoLoan_PaymentHistory.xlsx',
    case: 'Williams Auto Loan',
    caseId: 'case-003',
    type: 'Payment History',
    category: 'Auto Loan',
    uploaded: '2025-04-11',
    status: 'processed',
    confidence: 96.4,
    size: '0.8 MB',
    format: 'xlsx',
    uploadedBy: 'John Doe',
    path: '/documents/cases/williams-auto/payments/'
  },
  {
    id: 'doc-010',
    name: 'Davis_Mortgage_Statement_Jan2025.pdf',
    case: 'Davis Mortgage Default',
    caseId: 'case-004',
    type: 'Account Statement',
    category: 'Mortgage',
    uploaded: '2025-04-06',
    status: 'processed',
    confidence: 94.8,
    size: '1.6 MB',
    format: 'pdf',
    uploadedBy: 'Michael Johnson',
    path: '/documents/cases/davis-mortgage/statements/'
  }
];

// Document types
const documentTypes = [
  'Account Statement',
  'Collection Notice',
  'Credit Agreement',
  'Credit Application',
  'Default Notice',
  'Insurance Claim',
  'Invoice',
  'Legal Filing',
  'Payment History',
  'Payment Receipt'
];

// Category types with icons
const categories = [
  { name: 'Credit Card', icon: <CreditCardIcon /> },
  { name: 'Medical', icon: <MedicalInformationIcon /> },
  { name: 'Auto Loan', icon: <ReceiptLongIcon /> },
  { name: 'Mortgage', icon: <HomeIcon /> },
  { name: 'Student Loan', icon: <SchoolIcon /> },
  { name: 'Personal Loan', icon: <AccountBalanceIcon /> }
];

// Document file formats
const fileFormats = {
  pdf: <PictureAsPdfIcon />,
  jpg: <ImageIcon />,
  jpeg: <ImageIcon />,
  png: <ImageIcon />,
  tiff: <ImageIcon />,
  xlsx: <DescriptionIcon />,
  docx: <DescriptionIcon />,
  doc: <DescriptionIcon />
};

// Get format icon based on file extension
const getFormatIcon = (format) => {
  return fileFormats[format.toLowerCase()] || <InsertDriveFileIcon />;
};

// Get status icon based on status
const getStatusIcon = (status) => {
  switch (status) {
    case 'processed':
      return <CheckCircleIcon color="success" />;
    case 'processing':
      return <HourglassEmptyIcon color="primary" />;
    case 'pending':
      return <HourglassEmptyIcon color="disabled" />;
    case 'error':
      return <ErrorIcon color="error" />;
    default:
      return <HourglassEmptyIcon />;
  }
};

// Get category icon
const getCategoryIcon = (category) => {
  const categoryObj = categories.find(cat => cat.name === category);
  return categoryObj ? categoryObj.icon : <DescriptionIcon />;
};

// Get status chip
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

function DocumentBrowser() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
  const [sort, setSort] = useState({ field: 'uploaded', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };
  
  // Toggle filters expanded
  const toggleFiltersExpanded = () => {
    setFiltersExpanded(!filtersExpanded);
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sort.field === field) {
      setSort({
        ...sort,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSort({
        field,
        direction: 'asc'
      });
    }
  };
  
  // Handle row selection (checkbox)
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredDocuments.map(doc => doc.id);
      setSelectedDocuments(newSelected);
      return;
    }
    setSelectedDocuments([]);
  };
  
  // Handle row click (checkbox)
  const handleRowClick = (event, id) => {
    const selectedIndex = selectedDocuments.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selectedDocuments, id];
    } else {
      newSelected = selectedDocuments.filter(docId => docId !== id);
    }
    
    setSelectedDocuments(newSelected);
  };
  
  // Handle row double click (navigate)
  const handleRowDoubleClick = (id) => {
    navigate(`/documents/${id}`);
  };
  
  // Handle document menu open
  const handleMenuOpen = (event, document) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };
  
  // Handle document menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle view document
  const handleViewDocument = (id) => {
    navigate(`/documents/${id}`);
  };
  
  // Handle process document
  const handleProcessDocument = (id) => {
    navigate(`/documents/${id}/process`);
  };
  
  // Handle delete document
  const handleDeleteDocument = (docs) => {
    setDocumentsToDelete(Array.isArray(docs) ? docs : [docs]);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Confirm delete document
  const confirmDeleteDocument = () => {
    // Here you would make API call to delete documents
    console.log('Deleting documents:', documentsToDelete);
    
    // Clear selected documents if they were deleted
    setSelectedDocuments(
      selectedDocuments.filter(id => !documentsToDelete.includes(id))
    );
    
    setDeleteDialogOpen(false);
    setDocumentsToDelete([]);
  };
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle view mode change (list/grid)
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  // Handle upload document
  const handleUploadDocument = () => {
    navigate('/upload');
  };
  
  // Filter and sort documents
  const filteredDocuments = mockDocuments.filter(doc => {
    // Search term filter
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced filters
    const matchesType = !filters.type || doc.type === filters.type;
    const matchesCategory = !filters.category || doc.category === filters.category;
    const matchesStatus = !filters.status || doc.status === filters.status;
    
    // Date filters
    let matchesDateFrom = true;
    let matchesDateTo = true;
    
    if (filters.dateFrom) {
      matchesDateFrom = isAfter(
        parseISO(doc.uploaded), 
        parseISO(filters.dateFrom)
      ) || doc.uploaded === filters.dateFrom;
    }
    
    if (filters.dateTo) {
      matchesDateTo = isAfter(
        parseISO(filters.dateTo), 
        parseISO(doc.uploaded)
      ) || doc.uploaded === filters.dateTo;
    }
    
    // Tab filters
    let matchesTab = true;
    if (tabValue === 1) matchesTab = doc.status === 'processed';
    if (tabValue === 2) matchesTab = doc.status === 'processing';
    if (tabValue === 3) matchesTab = doc.status === 'pending';
    if (tabValue === 4) matchesTab = doc.status === 'error';
    
    return matchesSearch && 
           matchesType && 
           matchesCategory && 
           matchesStatus && 
           matchesDateFrom && 
           matchesDateTo &&
           matchesTab;
  }).sort((a, b) => {
    // Sort documents
    const fieldA = a[sort.field];
    const fieldB = b[sort.field];
    
    if (fieldA < fieldB) {
      return sort.direction === 'asc' ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Get documents for current page
  const paginatedDocuments = filteredDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Check if a row is selected
  const isSelected = (id) => selectedDocuments.indexOf(id) !== -1;
  
  // Get table columns for sorting
  const getTableHeaders = () => {
    const headers = [
      { field: 'name', label: 'Document Name' },
      { field: 'type', label: 'Type' },
      { field: 'case', label: 'Case' },
      { field: 'uploaded', label: 'Uploaded' },
      { field: 'status', label: 'Status' },
      { field: 'size', label: 'Size' }
    ];
    
    return headers.map(header => (
      <TableCell 
        key={header.field}
        sortDirection={sort.field === header.field ? sort.direction : false}
        onClick={() => handleSortChange(header.field)}
        sx={{ cursor: 'pointer' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {header.label}
          {sort.field === header.field && (
            <Box component="span" sx={{ ml: 0.5 }}>
              {sort.direction === 'asc' ? '▲' : '▼'}
            </Box>
          )}
        </Box>
      </TableCell>
    ));
  };
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Documents</Typography>
        
        <Box>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadDocument}
          >
            Upload Document
          </Button>
        </Box>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search documents by name, case, type..."
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
                      onClick={handleClearSearch}
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedDocuments.length > 0 && (
                <Box sx={{ mr: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteDocument(selectedDocuments)}
                  >
                    Delete ({selectedDocuments.length})
                  </Button>
                </Box>
              )}
              
              <Tooltip title="List View">
                <IconButton 
                  color={viewMode === 'list' ? 'primary' : 'default'} 
                  onClick={() => handleViewModeChange('list')}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Grid View">
                <IconButton 
                  color={viewMode === 'grid' ? 'primary' : 'default'} 
                  onClick={() => handleViewModeChange('grid')}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={toggleFiltersExpanded}
                sx={{ ml: 2 }}
              >
                {filtersExpanded ? 'Hide Filters' : 'Filters'}
              </Button>
            </Box>
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
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Document Type"
                  >
                    <MenuItem value="">
                      <em>All Types</em>
                    </MenuItem>
                    {documentTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>All Categories</em>
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.name} value={category.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {React.cloneElement(category.icon, { fontSize: 'small', sx: { mr: 1 } })}
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">
                      <em>All Statuses</em>
                    </MenuItem>
                    <MenuItem value="processed">Processed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} minWidth={180}>
                <TextField
                  fullWidth
                  size="small"
                  name="dateFrom"
                  label="Date From"
                  type="date"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} minWidth={180}>
                <TextField
                  fullWidth
                  size="small"
                  name="dateTo"
                  label="Date To"
                  type="date"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    onClick={handleClearFilters}
                    startIcon={<ClearIcon />}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                All
                <Chip 
                  label={mockDocuments.length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Processed
                <Chip 
                  label={mockDocuments.filter(doc => doc.status === 'processed').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Processing
                <Chip 
                  label={mockDocuments.filter(doc => doc.status === 'processing').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Pending
                <Chip 
                  label={mockDocuments.filter(doc => doc.status === 'pending').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={mockDocuments.filter(doc => doc.status === 'error').length} color="error">
                  Errors
                </Badge>
              </Box>
            } />
          </Tabs>
        </Box>
      </Paper>
      
      {/* Document List View */}
      {viewMode === 'list' && (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedDocuments.length > 0 && 
                        selectedDocuments.length < filteredDocuments.length
                      }
                      checked={
                        filteredDocuments.length > 0 && 
                        selectedDocuments.length === filteredDocuments.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {getTableHeaders()}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDocuments.length > 0 ? (
                  paginatedDocuments.map((document) => {
                    const isDocSelected = isSelected(document.id);
                    
                    return (
                      <TableRow 
                        key={document.id}
                        hover
                        role="checkbox"
                        selected={isDocSelected}
                        onClick={(event) => handleRowClick(event, document.id)}
                        onDoubleClick={() => handleRowDoubleClick(document.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isDocSelected}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => handleRowClick(event, document.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                bgcolor: 
                                  document.status === 'processed' ? alpha(theme.palette.success.main, 0.1) :
                                  document.status === 'error' ? alpha(theme.palette.error.main, 0.1) :
                                  document.status === 'processing' ? alpha(theme.palette.primary.main, 0.1) :
                                  alpha(theme.palette.grey[500], 0.1)
                              }}
                            >
                              {React.cloneElement(getFormatIcon(document.format), { 
                                fontSize: 'small',
                                color: 
                                  document.status === 'processed' ? 'success' :
                                  document.status === 'error' ? 'error' :
                                  document.status === 'processing' ? 'primary' : 
                                  'action'
                              })}
                            </Avatar>
                            <Typography variant="body2">
                              {document.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {React.cloneElement(getCategoryIcon(document.category), { 
                              fontSize: 'small', 
                              sx: { mr: 0.5 },
                              color: 'action'
                            })}
                            {document.type}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FolderIcon 
                              fontSize="small" 
                              sx={{ mr: 0.5 }}
                              color="action"
                            />
                            {document.case}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {format(parseISO(document.uploaded), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(document.status, document.confidence)}
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
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <InsertDriveFileIcon 
                          sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} 
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No documents found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm 
                            ? "Try adjusting your search or filters"
                            : "Upload documents to get started"
                          }
                        </Typography>
                        {!searchTerm && (
                          <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleUploadDocument}
                            sx={{ mt: 2 }}
                          >
                            Upload Document
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      )}
      
      {/* Document Grid View */}
      {viewMode === 'grid' && (
        <>
          <Grid container spacing={2}>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((document) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={document.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleViewDocument(document.id)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 1,
                            bgcolor: 
                              document.status === 'processed' ? alpha(theme.palette.success.main, 0.1) :
                              document.status === 'error' ? alpha(theme.palette.error.main, 0.1) :
                              document.status === 'processing' ? alpha(theme.palette.primary.main, 0.1) :
                              alpha(theme.palette.grey[500], 0.1)
                          }}
                        >
                          {React.cloneElement(getFormatIcon(document.format), { 
                            fontSize: 'small',
                            color: 
                              document.status === 'processed' ? 'success' :
                              document.status === 'error' ? 'error' :
                              document.status === 'processing' ? 'primary' : 
                              'action'
                          })}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {document.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {document.size} • {format(parseISO(document.uploaded), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, document);
                          }}
                          sx={{ mt: -0.5, mr: -0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Type
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {React.cloneElement(getCategoryIcon(document.category), { 
                              fontSize: 'small', 
                              sx: { mr: 0.5 },
                              color: 'action'
                            })}
                            <Typography variant="body2" noWrap>
                              {document.type}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Status
                          </Typography>
                          {getStatusChip(document.status, document.confidence)}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Case
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FolderIcon 
                              fontSize="small" 
                              sx={{ mr: 0.5 }}
                              color="action"
                            />
                            <Typography variant="body2" noWrap>
                              {document.case}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Checkbox
                        checked={isSelected(document.id)}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowClick(event, document.id);
                        }}
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0,
                          m: 0.5
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <InsertDriveFileIcon 
                    sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} 
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No documents found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm 
                      ? "Try adjusting your search or filters"
                      : "Upload documents to get started"
                    }
                  </Typography>
                  {!searchTerm && (
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={handleUploadDocument}
                      sx={{ mt: 2 }}
                    >
                      Upload Document
                    </Button>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <TablePagination
              rowsPerPageOptions={[8, 12, 24, 36]}
              component="div"
              count={filteredDocuments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Box>
        </>
      )}
      
      {/* Document Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewDocument(selectedDocument?.id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        {selectedDocument?.status === 'pending' && (
          <MenuItem onClick={() => {
            handleProcessDocument(selectedDocument?.id);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <DocumentScannerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Process Document</ListItemText>
          </MenuItem>
        )}
        
        {selectedDocument?.status === 'error' && (
          <MenuItem onClick={() => {
            handleProcessDocument(selectedDocument?.id);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <DocumentScannerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Retry Processing</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Path</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleDeleteDocument(selectedDocument?.id);
        }} sx={{ color: 'error.main' }}>
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
          Delete {documentsToDelete.length > 1 ? 'Documents' : 'Document'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {documentsToDelete.length > 1 
              ? `these ${documentsToDelete.length} documents` 
              : 'this document'
            }? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteDocument} 
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

export default DocumentBrowser;