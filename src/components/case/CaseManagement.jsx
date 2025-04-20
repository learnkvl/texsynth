// src/components/case/CaseManagement.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

// Mock data for cases
const mockCases = [
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
    overdueDocuments: 0,
    assignedTo: 'Sarah Adams',
    dateCreated: '2025-03-15',
    nextAction: 'Send collection notice',
    nextActionDate: '2025-04-20'
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
    overdueDocuments: 2,
    assignedTo: 'Michael Johnson',
    dateCreated: '2025-03-22',
    nextAction: 'Validate debt documents',
    nextActionDate: '2025-04-18'
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
    overdueDocuments: 0,
    assignedTo: 'John Doe',
    dateCreated: '2025-03-25',
    nextAction: 'Follow up on payment plan',
    nextActionDate: '2025-04-25'
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
    overdueDocuments: 0,
    assignedTo: 'Sarah Adams',
    dateCreated: '2025-02-12',
    nextAction: 'Court filing preparation',
    nextActionDate: '2025-04-22'
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
    overdueDocuments: 1,
    assignedTo: 'Michael Johnson',
    dateCreated: '2025-03-30',
    nextAction: 'Income verification',
    nextActionDate: '2025-04-19'
  },
  { 
    id: 'case-006', 
    name: 'Thompson Personal Loan', 
    client: 'ABC Collections',
    debtorName: 'James Thompson',
    accountType: 'Personal Loan',
    principalAmount: 5250.00,
    interestAmount: 750.25,
    totalAmount: 6000.25,
    status: 'active',
    lastActivity: '2025-04-11',
    documentCount: 5,
    overdueDocuments: 0,
    assignedTo: 'John Doe',
    dateCreated: '2025-03-20',
    nextAction: 'Send payment reminder',
    nextActionDate: '2025-04-21'
  },
  { 
    id: 'case-007', 
    name: 'Jackson Credit Card', 
    client: 'ABC Collections',
    debtorName: 'David Jackson',
    accountType: 'Credit Card',
    principalAmount: 7850.50,
    interestAmount: 920.75,
    totalAmount: 8771.25,
    status: 'closed',
    lastActivity: '2025-04-05',
    documentCount: 10,
    overdueDocuments: 0,
    assignedTo: 'Sarah Adams',
    dateCreated: '2025-02-25',
    nextAction: 'Case closed - paid in full',
    nextActionDate: null
  }
];

// Helper function to get account type icon
const getAccountTypeIcon = (accountType) => {
  switch(accountType) {
    case 'Credit Card':
      return <CreditCardIcon />;
    case 'Medical':
      return <MedicalInformationIcon />;
    case 'Auto Loan':
      return <DirectionsCarIcon />;
    case 'Mortgage':
      return <HomeIcon />;
    case 'Student Loan':
      return <SchoolIcon />;
    default:
      return <AttachMoneyIcon />;
  }
};

// Helper function to get case status chip
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

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

function CaseManagement() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    accountType: '',
    status: '',
    assignedTo: ''
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle menu open
  const handleMenuOpen = (event, caseItem) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedCase(caseItem);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle create case
  const handleCreateCase = () => {
    navigate('/cases/create');
  };
  
  // Handle case click
  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };
  
  // Handle view case
  const handleViewCase = (caseId) => {
    navigate(`/cases/${caseId}`);
    handleMenuClose();
  };
  
  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Toggle filters expanded
  const toggleFiltersExpanded = () => {
    setFiltersExpanded(!filtersExpanded);
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
      client: '',
      accountType: '',
      status: '',
      assignedTo: ''
    });
  };
  
  // Filter cases based on search term and filters
  const filteredCases = mockCases.filter(caseItem => {
    // Search term filter
    const matchesSearch = 
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced filters
    const matchesClient = !filters.client || caseItem.client === filters.client;
    const matchesAccountType = !filters.accountType || caseItem.accountType === filters.accountType;
    const matchesStatus = !filters.status || caseItem.status === filters.status;
    const matchesAssignedTo = !filters.assignedTo || caseItem.assignedTo === filters.assignedTo;
    
    // Tab filters
    let matchesTab = true;
    if (tabValue === 1) matchesTab = caseItem.status === 'active';
    if (tabValue === 2) matchesTab = caseItem.status === 'pending';
    if (tabValue === 3) matchesTab = caseItem.status === 'legal';
    if (tabValue === 4) matchesTab = caseItem.status === 'closed';
    
    return matchesSearch && 
           matchesClient && 
           matchesAccountType && 
           matchesStatus && 
           matchesAssignedTo &&
           matchesTab;
  });
  
  // Get unique values for filters
  const clients = [...new Set(mockCases.map(c => c.client))];
  const accountTypes = [...new Set(mockCases.map(c => c.accountType))];
  const statuses = [...new Set(mockCases.map(c => c.status))];
  const assignees = [...new Set(mockCases.map(c => c.assignedTo))];
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Cases</Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCase}
        >
          Create Case
        </Button>
      </Box>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
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
                    {mockCases.length}
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
                    {mockCases.filter(c => c.status === 'active').length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="body2">
                    {mockCases.filter(c => c.status === 'pending').length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Legal
                  </Typography>
                  <Typography variant="body2">
                    {mockCases.filter(c => c.status === 'legal').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ minWidth: '275px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.warning.light,
                    width: 40,
                    height: 40,
                    mr: 2
                  }}
                >
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    5
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Actions Due This Week
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Overdue
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    1
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Today
                  </Typography>
                  <Typography variant="body2">
                    2
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tomorrow
                  </Typography>
                  <Typography variant="body2">
                    2
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
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
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    ${mockCases.reduce((total, c) => total + c.totalAmount, 0).toLocaleString()}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Total Debt Amount
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Principal
                  </Typography>
                  <Typography variant="body2">
                    ${mockCases.reduce((total, c) => total + c.principalAmount, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Interest
                  </Typography>
                  <Typography variant="body2">
                    ${mockCases.reduce((total, c) => total + c.interestAmount, 0).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: '275px' }}>
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
                  <DescriptionIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {mockCases.reduce((total, c) => total + c.documentCount, 0)}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Total Documents
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pending Review
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    {mockCases.reduce((total, c) => total + c.overdueDocuments, 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recent Uploads
                  </Typography>
                  <Typography variant="body2">
                    12
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search cases by name, debtor, client..."
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
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={toggleFiltersExpanded}
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
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Client"
                  name="client"
                  value={filters.client}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client} value={client}>{client}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Account Type"
                  name="accountType"
                  value={filters.accountType}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {accountTypes.map(type => (
                    <MenuItem key={type} value={type} sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.cloneElement(getAccountTypeIcon(type), { 
                        fontSize: 'small',
                        sx: { mr: 1 }
                      })}
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} minWidth={180}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Assigned To"
                  name="assignedTo"
                  value={filters.assignedTo}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Staff</MenuItem>
                  {assignees.map(assignee => (
                    <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                  ))}
                </TextField>
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
                  label={mockCases.length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Active
                <Chip 
                  label={mockCases.filter(c => c.status === 'active').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Pending
                <Chip 
                  label={mockCases.filter(c => c.status === 'pending').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Legal
                <Chip 
                  label={mockCases.filter(c => c.status === 'legal').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Closed
                <Chip 
                  label={mockCases.filter(c => c.status === 'closed').length} 
                  size="small" 
                  sx={{ ml: 1, height: 20, minWidth: 20 }} 
                />
              </Box>
            } />
          </Tabs>
        </Box>
      </Paper>
      
      {/* Cases Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case Name</TableCell>
                <TableCell>Debtor</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Next Action</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
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
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon 
                          fontSize="small" 
                          sx={{ mr: 0.5 }}
                          color="action"
                        />
                        {caseItem.debtorName}
                      </Box>
                    </TableCell>
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
                      {caseItem.assignedTo}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {caseItem.nextAction}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {caseItem.nextActionDate ? formatDate(caseItem.nextActionDate) : 'N/A'}
                        </Typography>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <FolderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No cases found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm 
                          ? "Try adjusting your search or filters"
                          : "Create your first case to get started"
                        }
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateCase}
                          sx={{ mt: 2 }}
                        >
                          Create Case
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
      
      {/* Case Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewCase(selectedCase?.id)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Case</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Documents</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Invoice</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reassign Case</ListItemText>
        </MenuItem>
        
        {selectedCase?.status !== 'legal' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GavelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move to Legal</ListItemText>
          </MenuItem>
        )}
        
        {selectedCase?.status !== 'closed' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Close Case</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Case</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default CaseManagement;