// src/components/invoicing/EnhancedInvoiceUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Grid, 
  Paper, 
  Divider,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Breadcrumbs,
  Link,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Switch,
  FormControlLabel,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Badge,
  Popover
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

import Slider from '@mui/material/Slider';


// Chart components for statistics popup
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';

// Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import SendIcon from '@mui/icons-material/Send';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightIcon from '@mui/icons-material/Highlight';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PrintIcon from '@mui/icons-material/Print';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Create styled components for file upload
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const InvisibleInput = styled('input')({
  display: 'none',
});

const DocumentViewPort = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f5f5f5',
  height: '70vh',
  position: 'relative',
  overflowY: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const ViewerToolbar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.65)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  zIndex: 10,
  backdropFilter: 'blur(4px)',
}));

const HighlightBox = styled(Box)(({ theme, type = 'default' }) => {
  const colors = {
    account: theme.palette.primary.main,
    date: theme.palette.secondary.main,
    amount: theme.palette.success.main,
    entity: theme.palette.warning.main,
    default: theme.palette.info.main,
    error: theme.palette.error.main
  };
  
  return {
    position: 'absolute',
    border: `2px solid ${colors[type]}`,
    backgroundColor: colors[type],
    opacity: 0.1,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 0.3,
    }
  };
});

// Mock invoice templates
const invoiceTemplates = [
  { id: 1, name: 'Standard Legal Services', description: 'Basic legal services invoice template' },
  { id: 2, name: 'Collection Services', description: 'Specialized for debt collection services' },
  { id: 3, name: 'Litigation Package', description: 'For court-related fees and legal filings' },
  { id: 4, name: 'Medical Debt Recovery', description: 'Tailored for healthcare debt collection' },
  { id: 5, name: 'Auto Loan Default', description: 'Specific to automotive loan collection' },
];

// Mock OCR processing status
const mockProcessingSteps = [
  { id: 'upload', label: 'Document Upload', status: 'completed' },
  { id: 'preprocess', label: 'Image Pre-processing', status: 'completed' },
  { id: 'ocr', label: 'OCR Processing', status: 'completed' },
  { id: 'extraction', label: 'Field Extraction', status: 'active' },
  { id: 'classification', label: 'Document Classification', status: 'pending' },
  { id: 'validation', label: 'Data Validation', status: 'pending' }
];

// Mock clients for autocomplete
const clients = [
  { id: 1, name: 'Johnson & Partners LLP', email: 'billing@johnsonpartners.com', address: '123 Legal St, New York, NY 10001' },
  { id: 2, name: 'Smith Collections Agency', email: 'accounts@smithcollections.com', address: '456 Finance Ave, Chicago, IL 60601' },
  { id: 3, name: 'Adams Credit Recovery', email: 'invoicing@adamsrecovery.com', address: '789 Main St, Los Angeles, CA 90001' },
];

// Mock detected entities from OCR
const mockDetectedEntities = {
  client: "Johnson & Partners LLP",
  matter: "Big Bank Inc. Collections",
  debtorName: "Jane Doe",
  accountNumber: "ACC-45678-90",
  principalAmount: "$2,450.00",
  interestAmount: "$245.75",
  totalAmount: "$2,695.75", 
  serviceDate: "January 5, 2025",
  dueDate: "February 4, 2025",
  lineItems: [
    { description: "Debt Collection Services", amount: "$1,200.00" },
    { description: "Skip Tracing", amount: "$350.00" },
    { description: "Document Processing (10 @ $45.00 each)", amount: "$450.00" },
    { description: "Legal Filing Fees", amount: "$450.00" }
  ]
};

// Mock statistics data
const mockStatistics = {
  invoicesByType: [
    { name: 'Standard Legal', value: 35 },
    { name: 'Collection Services', value: 25 },
    { name: 'Litigation', value: 20 },
    { name: 'Medical Debt', value: 15 },
    { name: 'Auto Loan', value: 5 },
  ],
  invoicesByStatus: [
    { name: 'Paid', value: 45 },
    { name: 'Sent', value: 30 },
    { name: 'Draft', value: 20 },
    { name: 'Overdue', value: 5 },
  ],
  monthlyInvoices: [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 18200 },
    { month: 'Mar', amount: 15800 },
    { month: 'Apr', amount: 22000 },
    { month: 'May', amount: 19500 },
    { month: 'Jun', amount: 24700 },
  ],
  totalInvoiced: 112700,
  totalPaid: 85300,
  averageInvoiceAmount: 2250,
  invoiceCount: 125,
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function EnhancedInvoiceUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState("idle"); // idle, processing, success, error
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [extractedEntities, setExtractedEntities] = useState(null);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showEntityDialog, setShowEntityDialog] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [highlightedCategories, setHighlightedCategories] = useState({
    account: true,
    date: true,
    amount: true,
    entity: true
  });
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [statsAnchorEl, setStatsAnchorEl] = useState(null);
  const [activeStatTab, setActiveStatTab] = useState(0);

  // Steps for invoice creation process
  const steps = ['Upload Document', 'Process & Extract', 'Review & Generate'];

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Reset states when new file is uploaded
      setProcessingStatus("idle");
      setProcessingProgress(0);
      setOcrComplete(false);
      setExtractedEntities(null);
    }
  };

  // Handle drop zone click
  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setUploadedFile(event.dataTransfer.files[0]);
      // Reset states when new file is uploaded
      setProcessingStatus("idle");
      setProcessingProgress(0);
      setOcrComplete(false);
      setExtractedEntities(null);
    }
  };

  // Prevent default drag behaviors
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle template selection
  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  // Handle document processing
  const handleProcessDocument = () => {
    if (!uploadedFile) return;
    
    setProcessingStatus("processing");
    setProcessingProgress(0);
    setCurrentStep('upload');
    
    // Simulated processing with steps
    const stepDurations = {
      upload: 1000,
      preprocess: 1500,
      ocr: 2500,
      extraction: 2000,
      classification: 1500,
      validation: 1000
    };
    
    let currentStepIndex = 0;
    const totalDuration = Object.values(stepDurations).reduce((sum, val) => sum + val, 0);
    
    const updateProgress = (elapsed, currentStep) => {
      const progressPercentage = (elapsed / totalDuration) * 100;
      setProcessingProgress(progressPercentage);
      setCurrentStep(currentStep);
    };
    
    let elapsed = 0;
    const processStep = (stepIndex) => {
      if (stepIndex >= mockProcessingSteps.length) {
        setProcessingStatus("success");
        setOcrComplete(true);
        setExtractedEntities(mockDetectedEntities);
        setOcrConfidence(85 + Math.random() * 10); // Random confidence between 85-95%
        return;
      }
      
      const step = mockProcessingSteps[stepIndex];
      setCurrentStep(step.id);
      
      setTimeout(() => {
        elapsed += stepDurations[step.id];
        updateProgress(elapsed, step.id);
        processStep(stepIndex + 1);
      }, stepDurations[step.id]);
    };
    
    processStep(0);
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Toggle dashboard dialog
  const toggleDashboardDialog = () => {
    setDashboardDialogOpen(!dashboardDialogOpen);
  };

  // Toggle preview dialog
  const togglePreviewDialog = () => {
    setPreviewDialogOpen(!previewDialogOpen);
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    // In a real app, this would send data to backend
    // For demo, navigate to invoice creation with pre-filled data
    navigate('/invoices/create');
  };

  // Handle remove file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProcessingStatus("idle");
    setProcessingProgress(0);
    setOcrComplete(false);
    setExtractedEntities(null);
  };

  // Handle entity selection
  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    setShowEntityDialog(true);
  };

  // Handle entity dialog close
  const handleCloseEntityDialog = () => {
    setShowEntityDialog(false);
  };

  // Toggle highlights for different entity types
  const handleToggleHighlight = (category) => {
    setHighlightedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle confidence threshold change
  const handleConfidenceChange = (event, newValue) => {
    setConfidenceThreshold(newValue);
  };

  // Toggle advanced settings
  const toggleAdvancedSettings = () => {
    setAdvancedSettings(!advancedSettings);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // Page navigation
  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  // Toggle statistics popover
  const handleStatsClick = (event) => {
    setStatsAnchorEl(event.currentTarget);
  };

  const handleStatsClose = () => {
    setStatsAnchorEl(null);
  };

  const handleStatTabChange = (event, newValue) => {
    setActiveStatTab(newValue);
  };

  // Get content for current step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Upload Document
        return (
          <Box>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Invoice Document
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Upload a document to automatically extract invoice information using OCR technology.
                  Supported formats: PDF, TIFF, JPG, PNG, DOC/DOCX
                </Typography>
                
                <UploadBox
                  onClick={handleDropZoneClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <InvisibleInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.tiff,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  
                  {!uploadedFile ? (
                    <>
                      <CloudUploadIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: 'text.secondary',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h6" gutterBottom>
                        Drag & Drop or Click to Upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload account statements, collection notices, or related documents
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <InsertDriveFileIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: 'primary.main',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h6" gutterBottom>
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {(uploadedFile.size / 1024).toFixed(2)} KB • {uploadedFile.type || "Unknown type"}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          Remove
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePreviewDialog();
                          }}
                        >
                          Preview
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </UploadBox>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Select Invoice Template
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose a template or let our AI automatically detect the best format
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="template-select-label">Invoice Template</InputLabel>
                  <Select
                    labelId="template-select-label"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    label="Invoice Template"
                  >
                    <MenuItem value="">
                      <em>Auto-detect (Recommended)</em>
                    </MenuItem>
                    {invoiceTemplates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Alert 
                  severity="info" 
                  sx={{ mb: 2 }}
                  icon={<AutoAwesomeIcon />}
                >
                  <Typography variant="body2">
                    Our AI will analyze your document and suggest the best template if auto-detect is selected.
                  </Typography>
                </Alert>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button 
                    variant="text" 
                    startIcon={<DocumentScannerIcon />}
                    onClick={togglePreviewDialog}
                    disabled={!uploadedFile}
                  >
                    Preview Document
                  </Button>
                  
                  <Button
                    variant="contained"
                    disabled={!uploadedFile}
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      
      case 1: // Process & Extract
        return (
          <Box>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Document Processing
                  </Typography>
                  
                  {processingStatus === "success" && (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Processing Complete" 
                      color="success" 
                    />
                  )}
                  
                  {processingStatus === "error" && (
                    <Chip 
                      icon={<ReportProblemIcon />} 
                      label="Processing Error" 
                      color="error" 
                    />
                  )}
                  
                  {processingStatus === "processing" && (
                    <Chip 
                      icon={<SyncIcon />} 
                      label="Processing..." 
                      color="primary" 
                    />
                  )}
                </Box>
                
                {processingStatus === "idle" && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Click "Process Document" to start extracting data from your uploaded file.
                  </Alert>
                )}
                
                {processingStatus === "processing" && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Processing document...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(processingProgress)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={processingProgress} 
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    
                    <Stack spacing={1} sx={{ mt: 3 }}>
                      {mockProcessingSteps.map((step) => {
                        let statusIcon;
                        let statusColor;
                        
                        if (currentStep === step.id) {
                          statusIcon = <CircularProgress size={16} />;
                          statusColor = 'primary.light';
                        } else if (mockProcessingSteps.findIndex(s => s.id === step.id) < mockProcessingSteps.findIndex(s => s.id === currentStep)) {
                          statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
                          statusColor = 'success.light';
                        } else {
                          statusIcon = <HourglassEmptyIcon fontSize="small" color="disabled" />;
                          statusColor = 'transparent';
                        }
                        
                        return (
                          <Box 
                            key={step.id} 
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1,
                              borderRadius: 1,
                              bgcolor: statusColor,
                              opacity: mockProcessingSteps.findIndex(s => s.id === step.id) > mockProcessingSteps.findIndex(s => s.id === currentStep) ? 0.6 : 1
                            }}
                          >
                            <Box sx={{ mr: 1, display: 'flex' }}>
                              {statusIcon}
                            </Box>
                            <Typography variant="body2">
                              {step.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
                
                {processingStatus === "success" && (
                  <Box sx={{ mb: 3 }}>
                    <Alert 
                      severity="success" 
                      icon={<CheckCircleIcon />}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="body2">
                        Document processing complete with {ocrConfidence.toFixed(1)}% confidence
                      </Typography>
                    </Alert>
                    
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Processing Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Document Type
                          </Typography>
                          <Typography variant="body2">
                            Collection Statement
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Pages Processed
                          </Typography>
                          <Typography variant="body2">
                            2
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Entities Extracted
                          </Typography>
                          <Typography variant="body2">
                            12
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            OCR Confidence
                          </Typography>
                          <Typography variant="body2">
                            {ocrConfidence.toFixed(1)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Template Matched
                          </Typography>
                          <Typography variant="body2">
                            Collection Services
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Processing Time
                          </Typography>
                          <Typography variant="body2">
                            8.2 seconds
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
                
                {processingStatus === "error" && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="body2">
                      An error occurred during processing. Please try again or upload a different document.
                    </Typography>
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={togglePreviewDialog}
                  >
                    View Document
                  </Button>
                  
                  {processingStatus !== "success" ? (
                    <Button
                      variant="contained"
                      onClick={handleProcessDocument}
                      disabled={processingStatus === "processing" || !uploadedFile}
                      startIcon={<DocumentScannerIcon />}
                    >
                      Process Document
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Review Extracted Data
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
            
            {processingStatus === "success" && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Suggested Template
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      Collection Services
                    </Typography>
                    <Chip 
                      label="AI Recommended" 
                      size="small" 
                      color="primary"
                      icon={<AutoAwesomeIcon />}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This template is optimized for debt collection invoices with payment history sections and fee structures common in collection agencies.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                    >
                      Change Template
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Continue
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );
      
      case 2: // Review & Generate
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Extracted Information
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        Review the extracted information and make corrections if needed.
                      </Typography>
                    </Alert>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Client"
                          value={extractedEntities.client}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Matter"
                          value={extractedEntities.matter}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Debtor Name"
                          value={extractedEntities.debtorName}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Account Number"
                          value={extractedEntities.accountNumber}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Principal Amount"
                          value={extractedEntities.principalAmount}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Interest Amount"
                          value={extractedEntities.interestAmount}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Service Date"
                          value={extractedEntities.serviceDate}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Due Date"
                          value={extractedEntities.dueDate}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                          Detected Line Items
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {extractedEntities.lineItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell align="right">{item.amount}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                  {extractedEntities.totalAmount}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Document Preview
                    </Typography>
                    
                    <Box sx={{ position: 'relative', height: 300, mb: 2 }}>
                      <DocumentViewPort>
                        {/* Simulated document image */}
                        <img 
                          src="/api/placeholder/600/800" 
                          alt="Document preview placeholder" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '95%', 
                            objectFit: 'contain',
                            transform: `scale(${zoom/100})`,
                            transition: 'transform 0.3s ease'
                          }}
                        />
                        
                        {/* Example entity highlights */}
                        <HighlightBox
                          type="account"
                          sx={{
                            top: '10%',
                            left: '40%',
                            width: '25%',
                            height: '3%'
                          }}
                        />
                        <HighlightBox
                          type="date"
                          sx={{
                            top: '15%',
                            left: '50%',
                            width: '15%',
                            height: '3%'
                          }}
                        />
                        <HighlightBox
                          type="amount"
                          sx={{
                            top: '25%',
                            left: '60%',
                            width: '12%',
                            height: '3%'
                          }}
                        />
                        <HighlightBox
                          type="entity"
                          sx={{
                            top: '20%',
                            left: '25%',
                            width: '20%',
                            height: '3%'
                          }}
                        />
                        
                        {/* Viewer toolbar */}
                        <ViewerToolbar>
                          <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Tooltip title="Previous Page">
                                <IconButton 
                                  size="small" 
                                  color="inherit" 
                                  onClick={handlePrevPage}
                                  disabled={pageNumber <= 1}
                                >
                                  <NavigateBeforeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Typography variant="body2" sx={{ color: 'white', mx: 1 }}>
                                {pageNumber} / {numPages || 2}
                              </Typography>
                              <Tooltip title="Next Page">
                                <IconButton 
                                  size="small" 
                                  color="inherit" 
                                  onClick={handleNextPage}
                                  disabled={pageNumber >= (numPages || 2)}
                                >
                                  <NavigateNextIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Tooltip title="Zoom Out">
                                <IconButton size="small" color="inherit" onClick={handleZoomOut}>
                                  <ZoomOutIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Zoom In">
                                <IconButton size="small" color="inherit" onClick={handleZoomIn}>
                                  <ZoomInIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Tooltip title="View Full Document">
                                <IconButton 
                                  size="small" 
                                  color="inherit"
                                  onClick={togglePreviewDialog}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Stack>
                        </ViewerToolbar>
                      </DocumentViewPort>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        OCR Confidence: {ocrConfidence.toFixed(1)}%
                      </Typography>
                      <Chip 
                        label={ocrConfidence > 90 ? "High Confidence" : "Medium Confidence"} 
                        color={ocrConfidence > 90 ? "success" : "warning"} 
                        size="small" 
                      />
                    </Box>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Actions
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<ReceiptIcon />}
                        onClick={handleGenerateInvoice}
                      >
                        Generate Invoice
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<SaveIcon />}
                      >
                        Save as Draft
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<SendIcon />}
                      >
                        Generate & Send
                      </Button>
                      
                      <Divider />
                      
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<BarChartIcon />}
                        onClick={handleStatsClick}
                      >
                        View Invoice Analytics
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  // Statistics Popover
  const statsPopover = (
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
                <Typography variant="h4">${mockStatistics.averageInvoiceAmount}</Typography>
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
  );

  // Preview dialog
  const PreviewDialog = () => (
    <Dialog
      open={previewDialogOpen}
      onClose={togglePreviewDialog}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Document Preview
        <IconButton
          aria-label="close"
          onClick={togglePreviewDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <Tabs value={0} sx={{ mb: 2 }}>
            <Tab label="Document" icon={<DescriptionIcon />} iconPosition="start" />
            <Tab label="OCR Text" icon={<TextSnippetIcon />} iconPosition="start" disabled={!ocrComplete} />
            <Tab label="Extracted Data" icon={<InfoIcon />} iconPosition="start" disabled={!ocrComplete} />
          </Tabs>
          
          <Box sx={{ position: 'relative', flex: 1, overflow: 'auto' }}>
            <DocumentViewPort sx={{ height: '100%' }}>
              {/* Simulated document image */}
              <img 
                src="/api/placeholder/600/800" 
                alt="Document preview placeholder" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '95%', 
                  objectFit: 'contain',
                  transform: `scale(${zoom/100})`,
                  transition: 'transform 0.3s ease'
                }}
              />
              
              {ocrComplete && (
                <>
                  {/* Example entity highlights */}
                  <HighlightBox
                    type="account"
                    sx={{
                      top: '10%',
                      left: '40%',
                      width: '25%',
                      height: '3%'
                    }}
                  />
                  <HighlightBox
                    type="date"
                    sx={{
                      top: '15%',
                      left: '50%',
                      width: '15%',
                      height: '3%'
                    }}
                  />
                  <HighlightBox
                    type="amount"
                    sx={{
                      top: '25%',
                      left: '60%',
                      width: '12%',
                      height: '3%'
                    }}
                  />
                  <HighlightBox
                    type="entity"
                    sx={{
                      top: '20%',
                      left: '25%',
                      width: '20%',
                      height: '3%'
                    }}
                  />
                </>
              )}
              
              {/* Viewer toolbar */}
              <ViewerToolbar>
                <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Previous Page">
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                      >
                        <NavigateBeforeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ color: 'white', mx: 1 }}>
                      {pageNumber} / {numPages || 2}
                    </Typography>
                    <Tooltip title="Next Page">
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={handleNextPage}
                        disabled={pageNumber >= (numPages || 2)}
                      >
                        <NavigateNextIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 150 }}>
                    <Tooltip title="Zoom Out">
                      <IconButton size="small" color="inherit" onClick={handleZoomOut}>
                        <ZoomOutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Slider
                      size="small"
                      value={zoom}
                      min={50}
                      max={200}
                      onChange={(e, newValue) => setZoom(newValue)}
                      sx={{ 
                        mx: 1, 
                        width: 80,
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.5,
                        },
                      }}
                    />
                    <Tooltip title="Zoom In">
                      <IconButton size="small" color="inherit" onClick={handleZoomIn}>
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Rotate Left">
                      <IconButton size="small" color="inherit">
                        <RotateLeftIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rotate Right">
                      <IconButton size="small" color="inherit">
                        <RotateRightIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Highlight Text">
                      <IconButton 
                        size="small" 
                        color="inherit"
                      >
                        <HighlightIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        size="small" 
                        color="inherit"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton 
                        size="small" 
                        color="inherit"
                      >
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </ViewerToolbar>
            </DocumentViewPort>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {ocrComplete && (
          <Button startIcon={<ReceiptIcon />} onClick={togglePreviewDialog}>
            Generate Invoice
          </Button>
        )}
        <Button onClick={togglePreviewDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Dashboard dialog
  const DashboardDialog = () => (
    <Dialog
      open={dashboardDialogOpen}
      onClose={toggleDashboardDialog}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Invoice Analytics Dashboard
        <IconButton
          aria-label="close"
          onClick={toggleDashboardDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                    <AttachMoneyIcon />
                  </Avatar>
                  <Typography variant="h6">Paid</Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  $7,200.75
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2 invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <HourglassEmptyIcon />
                  </Avatar>
                  <Typography variant="h6">Outstanding</Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  $1,750.50
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1 invoice
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                    <WarningIcon />
                  </Avatar>
                  <Typography variant="h6">Overdue</Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  $5,700.00
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2 invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                    <EditIcon />
                  </Avatar>
                  <Typography variant="h6">Drafts</Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  $4,000.50
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2 invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Charts & Graphs */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Invoice Status Overview
                </Typography>
                
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
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Invoice Types
                </Typography>
                
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
                      >
                        {mockStatistics.invoicesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDashboardDialog}>Close</Button>
        <Button variant="contained" component={RouterLink} to="/invoices">
          View All Invoices
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Entity detail dialog
  const EntityDialog = () => {
    if (!selectedEntity) return null;
    
    return (
      <Dialog 
        open={showEntityDialog} 
        onClose={handleCloseEntityDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Extracted Entity
          <IconButton
            aria-label="close"
            onClick={handleCloseEntityDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Extracted Text
                </Typography>
                <Typography variant="h6">
                  Account Number: ACC-45678-90
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Entity Type
              </Typography>
              <Chip 
                label="Account"
                color="primary"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Confidence Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  96.5%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={96.5} 
                  color="success"
                  sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Document Position
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    label="Top"
                    value="10%"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    label="Left"
                    value="40%"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    label="Width"
                    value="25%"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    label="Height"
                    value="3%"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<EditIcon />}>Edit Extraction</Button>
          <Button onClick={handleCloseEntityDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
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
        <Link 
          underline="hover" 
          color="inherit" 
          component={RouterLink} 
          to="/invoices"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ListIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Invoices
        </Link>
        <Typography color="text.primary">Upload & Process</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Upload & Process Invoice Document</Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<BarChartIcon />} 
            onClick={handleStatsClick}
            sx={{ mr: 1 }}
          >
            Invoice Analytics
          </Button>
          
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            component={RouterLink}
            to="/invoices/create"
          >
            Create Manually
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        {getStepContent(activeStep)}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        
        {activeStep !== steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={
              (activeStep === 0 && !uploadedFile) || 
              (activeStep === 1 && processingStatus !== "success")
            }
          >
            {activeStep === 0 ? 'Continue' : 'Review & Generate'}
          </Button>
        )}
        
        {activeStep === steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleGenerateInvoice}
            endIcon={<ReceiptIcon />}
          >
            Generate Invoice
          </Button>
        )}
      </Box>
      
      {/* Document Preview Dialog */}
      <PreviewDialog />
      
      {/* Analytics Dashboard Dialog */}
      <DashboardDialog />
      
      {/* Entity Detail Dialog */}
      <EntityDialog />
      
      {/* Statistics Popover */}
      {statsPopover}
    </Box>
  );
}

export default EnhancedInvoiceUpload;