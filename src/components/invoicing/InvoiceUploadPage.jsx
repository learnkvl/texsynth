// src/components/invoicing/InvoiceUploadPage.jsx
import React, { useState, useRef } from 'react';
import {
  // Add these to your existing imports
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar
} from '@mui/material';

import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';

// Ensure these icons are imported as well
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Add missing icons
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import  TemplateDetection  from  './TemplateDetection'  ;
import  OCREnhancement  from   './OCREnhancement';

import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Divider,
  CircularProgress,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
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
  useTheme
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

// Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  { label: 'Document Upload', status: 'completed' },
  { label: 'Pre-processing', status: 'completed' },
  { label: 'OCR Analysis', status: 'active' },
  { label: 'Data Extraction', status: 'pending' },
  { label: 'Invoice Generation', status: 'pending' },
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

function InvoiceUploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
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

  // Add these to your existing state variables
const [enhancedOcrData, setEnhancedOcrData] = useState(null);
const [qualityCheckResults, setQualityCheckResults] = useState([]);
const [detectedTemplateInfo, setDetectedTemplateInfo] = useState(null);

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
  
  // Add these handler functions to your component

// Handle template detection results
const handleTemplateDetected = (templateResults) => {
  setDetectedTemplateInfo(templateResults);

  // Auto-select template if confidence is high
  if (templateResults.confidence > 80) {
      const templateId = invoiceTemplates.find(
          (t) => t.name === templateResults.bestMatch
      )?.id;

      if (templateId) {
          setSelectedTemplate(templateId.toString());
      }
  }
};

// Handle enhanced OCR data
const handleOcrEnhancement = (enhancedData, qualityResults) => {
  setEnhancedOcrData(enhancedData);
  setQualityCheckResults(qualityResults);

  // Update extracted entities with enhanced data
  if (enhancedData && enhancedData.fields) {
      setExtractedEntities((prevEntities) => ({
          ...prevEntities,
          ...enhancedData.fields,
      }));
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
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setProcessingStatus("success");
          setOcrComplete(true);
          setExtractedEntities(mockDetectedEntities);
          setOcrConfidence(85 + Math.random() * 10); // Random confidence between 85-95%
          return 100;
        }
        
        return newProgress;
      });
    }, 600);
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
                  <Typography variant="h6">Document Processing</Typography>
      
                  {processingStatus === "success" && (
                    <Chip icon={<CheckCircleIcon />} label="Processing Complete" color="success" />
                  )}
      
                  {processingStatus === "error" && (
                    <Chip icon={<ReportProblemIcon />} label="Processing Error" color="error" />
                  )}
      
                  {processingStatus === "processing" && (
                    <Chip icon={<SyncIcon />} label="Processing..." color="primary" />
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
                      {mockProcessingSteps.map((step, index) => {
                        let statusIcon;
                        if (step.status === 'completed') {
                          statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
                        } else if (step.status === 'active') {
                          statusIcon = <CircularProgress size={16} />;
                        } else {
                          statusIcon = <HourglassEmptyIcon fontSize="small" color="disabled" />;
                        }
      
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              py: 0.5,
                              opacity: step.status === 'pending' ? 0.6 : 1
                            }}
                          >
                            {statusIcon}
                            <Typography variant="body2" sx={{ ml: 1 }}>
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
                    <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Document processing complete with {ocrConfidence.toFixed(1)}% confidence
                      </Typography>
                    </Alert>
      
                    {/* Add Template Detection Component */}
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <TemplateDetection
                          ocrData={{
                            fullText: "Sample OCR text would be here in real implementation",
                            textBlocks: [] // In real implementation, this would contain the OCR text blocks
                          }}
                          onTemplateDetected={handleTemplateDetected}
                        />
                      </CardContent>
                    </Card>
      
                    {/* Keep your existing processing summary */}
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Processing Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Document Type
                          </Typography>
                          <Typography variant="body2">Collection Statement</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Pages Processed
                          </Typography>
                          <Typography variant="body2">2</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Entities Extracted
                          </Typography>
                          <Typography variant="body2">12</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            OCR Confidence
                          </Typography>
                          <Typography variant="body2">{ocrConfidence.toFixed(1)}%</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Template Matched
                          </Typography>
                          <Typography variant="body2">Collection Services</Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <Typography variant="caption" color="text.secondary">
                            Processing Time
                          </Typography>
                          <Typography variant="body2">8.2 seconds</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
      
                {processingStatus === "error" && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      An error occurred during processing. Please try again or upload a different document.
                    </Typography>
                  </Alert>
                )}
      
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={togglePreviewDialog}>
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
                    <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}>
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
                    This template is optimized for debt collection invoices with payment history sections and fee structures
                    common in collection agencies.
                  </Typography>
      
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" startIcon={<EditIcon />} sx={{ mr: 1 }}>
                      Change Template
                    </Button>
                    <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}>
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
              {/* LEFT PANEL: Extracted Info */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Extracted Information
                    </Typography>
        
                    {/* ✅ Add OCR Enhancement Component here */}
                    {extractedEntities && (
                      <OCREnhancement
                        ocrData={{
                          fields: extractedEntities,
                          // In real implementation, include other OCR data
                        }}
                        templateType={detectedTemplateInfo?.bestMatch || 'Collection Services'}
                        onEnhancement={handleOcrEnhancement}
                      />
                    )}
        
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
                        <Paper variant="outlined" sx={{ p: 0 }}>
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
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
        
              {/* RIGHT PANEL: Preview & Actions */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Document Preview
                    </Typography>
        
                    <Paper
                      variant="outlined"
                      sx={{
                        height: 300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'background.default',
                        mb: 2
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Document preview available
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={togglePreviewDialog}
                          sx={{ mt: 1 }}
                        >
                          View Full Document
                        </Button>
                      </Box>
                    </Paper>
        
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        OCR Confidence: {ocrConfidence.toFixed(1)}%
                      </Typography>
                      <Chip
                        label={ocrConfidence > 90 ? 'High Confidence' : 'Medium Confidence'}
                        color={ocrConfidence > 90 ? 'success' : 'warning'}
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
        
                      <Button fullWidth variant="outlined" startIcon={<SaveIcon />}>
                        Save as Draft
                      </Button>
        
                      <Button fullWidth variant="outlined" startIcon={<SendIcon />}>
                        Generate & Send
                      </Button>
        
                      <Divider />
        
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<BarChartIcon />}
                        onClick={toggleDashboardDialog}
                      >
                        View Invoice Analytics
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        
            {/* ✅ Add Data Quality Results Section Below */}
            {qualityCheckResults.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Data Quality Results
                    </Typography>
        
                    <Stack spacing={1}>
                      {qualityCheckResults.map((check, index) => (
                        <Alert
                          key={index}
                          severity={check.severity}
                          icon={
                            check.severity === 'success' ? (
                              <CheckCircleIcon />
                            ) : (
                              <WarningIcon />
                            )
                          }
                        >
                          {check.message}
                          {check.details && (
                            <Typography
                              variant="caption"
                              component="div"
                              sx={{ mt: 0.5 }}
                            >
                              {Object.entries(check.details).map(([key, value], i) => (
                                <Box key={i} component="span" sx={{ display: 'block' }}>
                                  <strong>{key}:</strong> {value}
                                </Box>
                              ))}
                            </Typography>
                          )}
                        </Alert>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Box>
        );
        
      
      default:
        return 'Unknown step';
    }
  };

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
        {uploadedFile ? (
          <Box sx={{ minHeight: 600, display: 'flex', flexDirection: 'column' }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This is a simulated document preview. In a real application, the actual document would be rendered here.
              </Typography>
            </Alert>
            
            {ocrComplete && (
              <Paper 
                variant="outlined" 
                sx={{ p: 2, mb: 2, border: '1px dashed', borderColor: 'primary.main' }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  <AutoAwesomeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                  AI-Detected Information
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={`Client: ${extractedEntities?.client}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`Account: ${extractedEntities?.accountNumber}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`Amount: ${extractedEntities?.totalAmount}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`Due Date: ${extractedEntities?.dueDate}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </Paper>
            )}
            
            <Box 
              sx={{ 
                flexGrow: 1, 
                border: '1px solid', 
                borderColor: 'divider',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                position: 'relative'
              }}
            >
              <img 
                src="/api/placeholder/600/800" 
                alt="Document preview placeholder" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
              
              {/* Simulated OCR highlights */}
              {ocrComplete && (
                <>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '15%',
                      left: '25%',
                      width: '50%',
                      height: '5%',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.main',
                      opacity: 0.1,
                      borderRadius: 1
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '25%',
                      left: '20%',
                      width: '30%',
                      height: '4%',
                      border: '2px solid',
                      borderColor: 'success.main',
                      backgroundColor: 'success.main',
                      opacity: 0.1,
                      borderRadius: 1
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '35%',
                      left: '60%',
                      width: '20%',
                      height: '3%',
                      border: '2px solid',
                      borderColor: 'error.main',
                      backgroundColor: 'error.main',
                      opacity: 0.1,
                      borderRadius: 1
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '45%',
                      left: '30%',
                      width: '40%',
                      height: '15%',
                      border: '2px solid',
                      borderColor: 'warning.main',
                      backgroundColor: 'warning.main',
                      opacity: 0.1,
                      borderRadius: 1
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No document uploaded
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a document to preview it here
            </Typography>
          </Box>
        )}
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
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
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
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
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
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
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
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
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
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Invoice Status Overview
                </Typography>
                
                <Box 
                  sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Typography color="text.secondary" align="center">
                    Bar chart visualization would appear here in the actual application<br />
                    (showing invoices by status category)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client Distribution
                </Typography>
                
                <Box 
                  sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Typography color="text.secondary" align="center">
                    Pie chart visualization would appear here<br />
                    (showing invoice amounts by client)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ border: 'none', boxShadow: theme.shadows[1] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>INV-20250101</TableCell>
                        <TableCell>Johnson & Partners LLP</TableCell>
                        <TableCell>$2,500.00</TableCell>
                        <TableCell>
                          <Chip size="small" label="Paid" color="success" />
                        </TableCell>
                        <TableCell>Jan 20, 2025</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>INV-20250115</TableCell>
                        <TableCell>Smith Collections Agency</TableCell>
                        <TableCell>$1,750.50</TableCell>
                        <TableCell>
                          <Chip size="small" label="Sent" color="primary" />
                        </TableCell>
                        <TableCell>Jan 15, 2025</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>INV-20250105</TableCell>
                        <TableCell>Johnson & Partners LLP</TableCell>
                        <TableCell>$1,200.00</TableCell>
                        <TableCell>
                          <Chip size="small" label="Overdue" color="error" />
                        </TableCell>
                        <TableCell>Jan 5, 2025</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
            onClick={toggleDashboardDialog}
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
    </Box>
  );
}

export default InvoiceUploadPage;