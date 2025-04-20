// src/components/case/CaseDetail.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Button, 
  IconButton, 
  Grid, 
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { format, parseISO, formatDistance, isAfter, subDays } from 'date-fns';

import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';


// Icons
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import GroupIcon from '@mui/icons-material/Group';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChatIcon from '@mui/icons-material/Chat';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

// Mock case data
const mockCase = {
  id: 'case-004',
  name: 'Davis Mortgage Default',
  client: {
    id: 'client-001',
    name: 'Homeowner Solutions',
    address: '789 Main Street, Chicago, IL 60601',
    contactPerson: 'Robert Anderson',
    email: 'robert@homeownersolutions.com',
    phone: '(312) 555-7890'
  },
  debtor: {
    id: 'debtor-004',
    name: 'Jennifer Davis',
    address: '456 Elm Street, Boston, MA 02108',
    email: 'jennifer.davis@example.com',
    phone: '(617) 555-1234',
    ssn: '***-**-1234',
    dob: '1985-06-15'
  },
  account: {
    id: 'acc-004',
    accountNumber: 'MTG-789012345',
    originalCreditor: 'First National Mortgage',
    currentOwner: 'Homeowner Solutions',
    accountType: 'Mortgage',
    openingDate: '2020-03-15',
    defaultDate: '2024-02-10',
    chargeOffDate: '2024-04-01'
  },
  financialData: {
    principalAmount: 45750.00,
    interestAmount: 3250.75,
    feesAmount: 750.00,
    totalAmount: 49750.75,
    interestRate: 4.5,
    minimumPayment: 1250.00
  },
  status: 'legal',
  priority: 'high',
  assignedTo: 'Sarah Adams',
  dateCreated: '2025-03-01',
  dateModified: '2025-04-08',
  dueDate: '2025-05-15',
  nextAction: 'Court filing preparation',
  nextActionDate: '2025-04-22',
  notes: [
    { 
      id: 'note-001', 
      text: 'Initial case review completed. Verified account documentation and default notice.', 
      createdBy: 'Sarah Adams', 
      createdAt: '2025-03-05', 
      type: 'general' 
    },
    { 
      id: 'note-002', 
      text: 'Sent initial demand letter to debtor. Awaiting response.', 
      createdBy: 'Sarah Adams', 
      createdAt: '2025-03-12', 
      type: 'communication' 
    },
    { 
      id: 'note-003', 
      text: 'No response received from initial demand letter. Preparing for legal action.', 
      createdBy: 'John Doe', 
      createdAt: '2025-03-30', 
      type: 'legal' 
    },
    { 
      id: 'note-004', 
      text: 'Legal team advised to proceed with court filing. Documentation ready for submission.', 
      createdBy: 'Sarah Adams', 
      createdAt: '2025-04-08', 
      type: 'legal' 
    }
  ],
  activities: [
    {
      id: 'activity-001',
      type: 'case_created',
      description: 'Case was created',
      user: 'System',
      timestamp: '2025-03-01T09:30:00Z'
    },
    {
      id: 'activity-002',
      type: 'note_added',
      description: 'Note added to case',
      user: 'Sarah Adams',
      timestamp: '2025-03-05T14:15:00Z'
    },
    {
      id: 'activity-003',
      type: 'document_uploaded',
      description: 'Document "Davis_Mortgage_Agreement.pdf" uploaded',
      user: 'Sarah Adams',
      timestamp: '2025-03-06T11:20:00Z'
    },
    {
      id: 'activity-004',
      type: 'document_uploaded',
      description: 'Document "Default_Notice_Feb2025.pdf" uploaded',
      user: 'Sarah Adams',
      timestamp: '2025-03-06T11:25:00Z'
    },
    {
      id: 'activity-005',
      type: 'communication',
      description: 'Sent initial demand letter to debtor',
      user: 'Sarah Adams',
      timestamp: '2025-03-12T10:00:00Z'
    },
    {
      id: 'activity-006',
      type: 'note_added',
      description: 'Note added to case',
      user: 'John Doe',
      timestamp: '2025-03-30T16:45:00Z'
    },
    {
      id: 'activity-007',
      type: 'status_change',
      description: 'Case status changed from "active" to "legal"',
      user: 'Sarah Adams',
      timestamp: '2025-04-05T13:30:00Z'
    },
    {
      id: 'activity-008',
      type: 'document_uploaded',
      description: 'Document "Legal_Filing_Preparation.pdf" uploaded',
      user: 'John Doe',
      timestamp: '2025-04-07T09:15:00Z'
    },
    {
      id: 'activity-009',
      type: 'note_added',
      description: 'Note added to case',
      user: 'Sarah Adams',
      timestamp: '2025-04-08T11:10:00Z'
    }
  ],
  documents: [
    {
      id: 'doc-004',
      name: 'Davis_Mortgage_Agreement.pdf',
      type: 'Credit Agreement',
      uploaded: '2025-03-06',
      status: 'processed',
      confidence: 95.1,
      size: '3.2 MB',
      uploadedBy: 'Sarah Adams'
    },
    {
      id: 'doc-005',
      name: 'Default_Notice_Feb2025.pdf',
      type: 'Default Notice',
      uploaded: '2025-03-06',
      status: 'processed',
      confidence: 93.7,
      size: '1.8 MB',
      uploadedBy: 'Sarah Adams'
    },
    {
	id: 'doc-005',
      name: 'Default_Notice_Feb2025.pdf',
      type: 'Default Notice',
      uploaded: '2025-03-06',
      status: 'processed',
      confidence: 93.7,
      size: '1.8 MB',
      uploadedBy: 'Sarah Adams'
    },
    {
      id: 'doc-006',
      name: 'Payment_History_Davis.xlsx',
      type: 'Payment History',
      uploaded: '2025-03-10',
      status: 'processed',
      confidence: 90.2,
      size: '0.9 MB',
      uploadedBy: 'Sarah Adams'
    },
    {
      id: 'doc-007',
      name: 'Legal_Filing_Preparation.pdf',
      type: 'Legal Filing',
      uploaded: '2025-04-07',
      status: 'processed',
      confidence: 88.5,
      size: '2.4 MB',
      uploadedBy: 'John Doe'
    }
  ],
  paymentHistory: [
    { date: '2023-03-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-04-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-05-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-06-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-07-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-08-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-09-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-10-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-11-15', type: 'Payment', amount: 1250.00 },
    { date: '2023-12-15', type: 'Payment', amount: 1250.00 },
    { date: '2024-01-15', type: 'Payment', amount: 1250.00 },
    { date: '2024-02-15', type: 'Late Fee', amount: -100.00 },
    { date: '2024-02-20', type: 'Partial Payment', amount: 750.00 },
    { date: '2024-03-15', type: 'Late Fee', amount: -100.00 },
    { date: '2024-03-20', type: 'Late Fee', amount: -150.00 },
    { date: '2024-03-25', type: 'No Payment', amount: 0.00 }
  ],
  reminders: [
    { id: 'reminder-001', task: 'Prepare court filing documents', dueDate: '2025-04-22', priority: 'high', status: 'pending' },
    { id: 'reminder-002', task: 'Schedule meeting with legal team', dueDate: '2025-04-25', priority: 'medium', status: 'pending' },
    { id: 'reminder-003', task: 'Review final documentation before submission', dueDate: '2025-05-01', priority: 'high', status: 'pending' }
  ],
  invoices: [
    { id: 'INV-20250315', amount: 1200.00, issueDate: '2025-03-15', dueDate: '2025-04-15', status: 'paid', description: 'Initial case assessment and documentation' },
    { id: 'INV-20250401', amount: 1750.50, issueDate: '2025-04-01', dueDate: '2025-05-01', status: 'sent', description: 'Legal proceedings preparation' }
  ]
};

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

// Get case priority chip
const getCasePriorityChip = (priority) => {
  switch(priority) {
    case 'high':
      return (
        <Chip
          label="High Priority"
          color="error"
          size="small"
        />
      );
    case 'medium':
      return (
        <Chip
          label="Medium Priority"
          color="warning"
          size="small"
        />
      );
    case 'low':
      return (
        <Chip
          label="Low Priority"
          color="info"
          size="small"
        />
      );
    default:
      return (
        <Chip
          label={priority}
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

// Get invoice status chip
const getInvoiceStatusChip = (status) => {
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

// Get activity icon based on activity type
const getActivityIcon = (activityType) => {
  switch(activityType) {
    case 'case_created':
      return <FolderIcon color="primary" />;
    case 'note_added':
      return <NoteAddIcon color="primary" />;
    case 'document_uploaded':
      return <CloudUploadIcon color="primary" />;
    case 'communication':
      return <ChatIcon color="primary" />;
    case 'status_change':
      return <AutorenewIcon color="warning" />;
    default:
      return <InfoIcon color="action" />;
  }
};

// Format timestamp to date and time
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Get time distance from now in a readable format
const getTimeAgo = (timestamp) => {
  return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
};

// Note type icon
const getNoteTypeIcon = (type) => {
  switch(type) {
    case 'legal':
      return <GavelIcon color="error" />;
    case 'communication':
      return <ChatIcon color="primary" />;
    default:
      return <NoteAddIcon color="action" />;
  }
};

// Task priority icon
const getTaskPriorityIcon = (priority) => {
  switch(priority) {
    case 'high':
      return <WarningIcon color="error" />;
    case 'medium':
      return <WarningIcon color="warning" />;
    case 'low':
      return <WarningIcon color="info" />;
    default:
      return <WarningIcon color="action" />;
  }
};

function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [remindersOpen, setRemindersOpen] = useState(true);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(true);
  
  // Fetch case data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API fetch
    setTimeout(() => {
      if (!id || id === mockCase.id) {
        setCaseData(mockCase);
        setIsLoading(false);
      } else {
        setError("Case not found");
        setIsLoading(false);
      }
    }, 1000);
  }, [id]);
  
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
  
  // Handle note dialog open
  const handleNoteDialogOpen = () => {
    setNoteDialogOpen(true);
  };
  
  // Handle note dialog close
  const handleNoteDialogClose = () => {
    setNoteDialogOpen(false);
    setNoteText('');
    setNoteType('general');
  };
  
  // Handle submit note
  const handleSubmitNote = () => {
    // In real app, this would save the note to backend
    console.log('Submitting note:', { text: noteText, type: noteType });
    handleNoteDialogClose();
  };
  
  // Handle upload document
  const handleUploadDocument = () => {
    navigate('/upload', { state: { caseId: id } });
  };
  
  // Handle create invoice
  const handleCreateInvoice = () => {
    navigate('/invoices/create', { state: { caseId: id } });
  };
  
  // Handle edit case
  const handleEditCase = () => {
    navigate(`/cases/edit/${id}`);
    handleMenuClose();
  };
  
  // Handle toggle reminders accordion
  const handleToggleReminders = () => {
    setRemindersOpen(!remindersOpen);
  };
  
  // Handle toggle payment history accordion
  const handleTogglePaymentHistory = () => {
    setPaymentHistoryOpen(!paymentHistoryOpen);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
      </Alert>
    );
  }
  
  // No case data
  if (!caseData) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="h6">Case Not Found</Typography>
        <Typography>The requested case does not exist or you don't have permission to view it.</Typography>
      </Alert>
    );
  }
  
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
        <Link 
          underline="hover" 
          color="inherit" 
          component={RouterLink} 
          to="/cases"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <FolderIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Cases
        </Link>
        <Typography color="text.primary">{caseData.name}</Typography>
      </Breadcrumbs>
      
      {/* Case Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" gutterBottom>{caseData.name}</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {getCaseStatusChip(caseData.status)}
              {getCasePriorityChip(caseData.priority)}
              <Chip 
                icon={getAccountTypeIcon(caseData.account.accountType)} 
                label={caseData.account.accountType} 
                size="small" 
                variant="outlined" 
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Case ID: {caseData.id} • Created: {formatDate(caseData.dateCreated)} • Last Modified: {formatDate(caseData.dateModified)}
            </Typography>
          </Box>
          
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditCase}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Case</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleUploadDocument}>
                <ListItemIcon>
                  <CloudUploadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Upload Document</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleCreateInvoice}>
                <ListItemIcon>
                  <ReceiptIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Create Invoice</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleNoteDialogOpen}>
                <ListItemIcon>
                  <NoteAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Note</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy Case ID</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PrintIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Print Case Summary</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Delete Case</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Alert 
              severity={caseData.status === 'legal' ? 'error' : caseData.status === 'pending' ? 'warning' : 'info'} 
              sx={{ mb: 2 }}
              icon={caseData.status === 'legal' ? <GavelIcon /> : <InfoIcon />}
            >
              <Typography variant="body2">
                <strong>Next Action:</strong> {caseData.nextAction} (Due: {formatDate(caseData.nextActionDate)})
              </Typography>
            </Alert>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assigned To
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography>{caseData.assignedTo}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Debtor
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main' }}>
                  <AccountBoxIcon fontSize="small" />
                </Avatar>
                <Typography>{caseData.debtor.name}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {caseData.debtor.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AlternateEmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {caseData.debtor.email}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Client
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'info.main' }}>
                  <BusinessIcon fontSize="small" />
                </Avatar>
                <Typography>{caseData.client.name}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {caseData.client.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AlternateEmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {caseData.client.email}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<NoteAddIcon />}
              onClick={handleNoteDialogOpen}
            >
              Add Note
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDocument}
            >
              Upload Document
            </Button>
          </Stack>
          
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>
      </Paper>
      
      {/* Case Detail Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Documents" />
          <Tab label="Financial" />
          <Tab label="Notes" />
          <Tab label="Activity Log" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          {tabValue === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader 
                      title="Account Information" 
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Account Number
                          </Typography>
                          <Typography variant="body1">
                            {caseData.account.accountNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Account Type
                          </Typography>
                          <Typography variant="body1">
                            {caseData.account.accountType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Original Creditor
                          </Typography>
                          <Typography variant="body1">
                            {caseData.account.originalCreditor}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Current Owner
                          </Typography>
                          <Typography variant="body1">
                            {caseData.account.currentOwner}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Opening Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(caseData.account.openingDate)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Default Date
                          </Typography>
                          <Typography variant="body1" color="error.main">
                            {formatDate(caseData.account.defaultDate)}
                          </Typography>
                        </Grid>
                        {caseData.account.chargeOffDate && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Charge-Off Date
                            </Typography>
                            <Typography variant="body1" color="error.main">
                              {formatDate(caseData.account.chargeOffDate)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 3 }}>
                    <CardHeader 
                      title="Debtor Information" 
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Name
                          </Typography>
                          <Typography variant="body1">
                            {caseData.debtor.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            SSN
                          </Typography>
                          <Typography variant="body1">
                            {caseData.debtor.ssn}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Date of Birth
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(caseData.debtor.dob)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {caseData.debtor.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {caseData.debtor.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {caseData.debtor.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader 
                      title="Case Reminders" 
                      titleTypographyProps={{ variant: 'h6' }}
                      action={
                        <IconButton onClick={handleToggleReminders}>
                          {remindersOpen ? <ExpandMoreIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      }
                    />
                    <Divider />
                    {remindersOpen && (
                      <CardContent sx={{ p: 0 }}>
                        <List>
                          {caseData.reminders.map((reminder) => (
                            <ListItem key={reminder.id} divider>
                              <ListItemIcon>
                                {getTaskPriorityIcon(reminder.priority)}
                              </ListItemIcon>
                              <ListItemText
                                primary={reminder.task}
                                secondary={`Due: ${formatDate(reminder.dueDate)}`}
                              />
                            </ListItem>
                          ))}
                          <ListItem>
                            <Button 
                              startIcon={<AddIcon />} 
                              fullWidth
                              sx={{ justifyContent: 'flex-start' }}
                            >
                              Add Reminder
                            </Button>
                          </ListItem>
                        </List>
                      </CardContent>
                    )}
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Accordion 
                    expanded={paymentHistoryOpen} 
                    onChange={handleTogglePaymentHistory}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Payment History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell align="right">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {caseData.paymentHistory.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(payment.date)}</TableCell>
                                <TableCell>{payment.type}</TableCell>
                                <TableCell 
                                  align="right"
                                  sx={{ 
                                    color: payment.amount < 0 ? 'error.main' : 
                                          payment.amount > 0 ? 'success.main' : 'text.primary'
                                  }}
                                >
                                  {payment.amount === 0 ? 
                                    '-' : 
                                    formatCurrency(payment.amount)
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Documents Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Case Documents</Typography>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUploadDocument}
                >
                  Upload Document
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Uploaded</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {caseData.documents.map((document) => (
                      <TableRow key={document.id}>
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
                              <DescriptionIcon 
                                fontSize="small"
                                color={
                                  document.status === 'processed' ? 'success' :
                                  document.status === 'error' ? 'error' :
                                  document.status === 'processing' ? 'primary' : 'action'
                                }
                              />
                            </Avatar>
                            <Typography variant="body2">
                              {document.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{document.type}</TableCell>
                        <TableCell>{formatDate(document.uploaded)}</TableCell>
                        <TableCell>
                          {getDocumentStatusChip(document.status, document.confidence)}
                        </TableCell>
                        <TableCell>{document.size}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Document">
                            <IconButton size="small" onClick={() => navigate(`/document/${document.id}`)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          {/* Financial Tab */}
          {tabValue === 2 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader 
                      title="Financial Summary" 
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Principal Amount
                          </Typography>
                          <Typography variant="body1">
                            {formatCurrency(caseData.financialData.principalAmount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Interest Amount
                          </Typography>
                          <Typography variant="body1">
                            {formatCurrency(caseData.financialData.interestAmount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Fees Amount
                          </Typography>
                          <Typography variant="body1">
                            {formatCurrency(caseData.financialData.feesAmount)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Interest Rate
                          </Typography>
                          <Typography variant="body1">
                            {caseData.financialData.interestRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Minimum Payment
                          </Typography>
                          <Typography variant="body1">
                            {formatCurrency(caseData.financialData.minimumPayment)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Total Amount Due</Typography>
                            <Typography variant="h6" color="error.main">
                              {formatCurrency(caseData.financialData.totalAmount)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader 
                      title="Invoices" 
                      titleTypographyProps={{ variant: 'h6' }}
                      action={
                        <Button
                          size="small"
                          startIcon={<ReceiptIcon />}
                          onClick={handleCreateInvoice}
                        >
                          Create Invoice
                        </Button>
                      }
                    />
                    <Divider />
                    <CardContent sx={{ p: 0 }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Invoice ID</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Due Date</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {caseData.invoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                                <TableCell align="right">{formatCurrency(invoice.amount)}</TableCell>
                                <TableCell>{getInvoiceStatusChip(invoice.status)}</TableCell>
                                <TableCell align="right">
                                  <Tooltip title="View Invoice">
                                    <IconButton size="small" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardHeader 
                      title="Payment History" 
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Divider />
                    <CardContent>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell align="right">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {caseData.paymentHistory.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(payment.date)}</TableCell>
                                <TableCell>{payment.type}</TableCell>
                                <TableCell 
                                  align="right"
                                  sx={{ 
                                    color: payment.amount < 0 ? 'error.main' : 
                                          payment.amount > 0 ? 'success.main' : 'text.primary'
                                  }}
                                >
                                  {payment.amount === 0 ? 
                                    '-' : 
                                    formatCurrency(payment.amount)
                                  }
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
            </Box>
          )}
          
          {/* Notes Tab */}
          {tabValue === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Case Notes</Typography>
                <Button
                  variant="contained"
                  startIcon={<NoteAddIcon />}
                  onClick={handleNoteDialogOpen}
                >
                  Add Note
                </Button>
              </Box>
              
              <List>
                {caseData.notes.map((note) => (
                  <Paper key={note.id} variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      p: 2,
                      borderLeft: 3,
                      borderColor: 
                        note.type === 'legal' ? 'error.main' :
                        note.type === 'communication' ? 'primary.main' : 'grey.500'
                    }}>
                      <Box sx={{ mr: 2 }}>
                        <Avatar sx={{ bgcolor: 
                          note.type === 'legal' ? 'error.light' :
                          note.type === 'communication' ? 'primary.light' : 'grey.300'
                        }}>
                          {getNoteTypeIcon(note.type)}
                        </Avatar>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {note.type.charAt(0).toUpperCase() + note.type.slice(1)} Note
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(note.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {note.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Added by: {note.createdBy}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </List>
            </Box>
          )}
          
          {/* Activity Log Tab */}
          {tabValue === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>Activity Log</Typography>
              
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: 'divider',
                    zIndex: 0
                  }}
                />
                
                <List>
                  {caseData.activities.map((activity) => (
                    <ListItem 
                      key={activity.id}
                      sx={{ 
                        position: 'relative',
                        pl: 4,
                        py: 1.5
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 32,
                          height: 32,
                          bgcolor: activity.type === 'status_change' ? 'warning.light' : 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Box>
                      
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(activity.timestamp)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                              •
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getTimeAgo(activity.timestamp)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                              •
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.user}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Add Note Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={handleNoteDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Note
          <IconButton
            aria-label="close"
            onClick={handleNoteDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="note-type-label">Note Type</InputLabel>
              <Select
                labelId="note-type-label"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                label="Note Type"
              >
                <MenuItem value="general">General Note</MenuItem>
                <MenuItem value="communication">Communication</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter note details here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoteDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitNote}
            disabled={!noteText.trim()}
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CaseDetail;// src/components/case/CaseDetail.jsx