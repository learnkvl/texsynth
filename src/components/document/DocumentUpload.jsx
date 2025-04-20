// src/components/document/DocumentUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Paper, 
  IconButton,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Divider} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';



// Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

// Mock OCR processing steps
const mockProcessingSteps = [
  { id: 'upload', label: 'Document Upload', status: 'completed' },
  { id: 'preprocess', label: 'Image Pre-processing', status: 'completed' },
  { id: 'ocr', label: 'OCR Processing', status: 'active' },
  { id: 'extraction', label: 'Field Extraction', status: 'pending' },
  { id: 'classification', label: 'Document Classification', status: 'pending' },
  { id: 'validation', label: 'Data Validation', status: 'pending' }
];

// Mock cases
const mockCases = [
  { 
    id: 'case-001', 
    name: 'Smith Credit Card Debt', 
    client: 'ABC Collections', 
    debtorName: 'John Smith',
    accountType: 'Credit Card'
  },
  { 
    id: 'case-002', 
    name: 'Johnson Medical Debt', 
    client: 'Healthcare Recovery',
    debtorName: 'Mary Johnson',
    accountType: 'Medical'
  },
  { 
    id: 'case-003', 
    name: 'Williams Auto Loan', 
    client: 'Auto Finance Recovery',
    debtorName: 'Robert Williams',
    accountType: 'Auto Loan'
  },
  { 
    id: 'case-004', 
    name: 'Davis Mortgage Default', 
    client: 'Homeowner Solutions',
    debtorName: 'Jennifer Davis',
    accountType: 'Mortgage'
  }
];

function DocumentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState("idle"); // idle, processing, success, error
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [documentNotes, setDocumentNotes] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);



  const togglePreviewDialog = () => {
    setPreviewDialogOpen(!previewDialogOpen);
  };

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
                src={uploadedFile.preview} 
                alt="Document preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  transform: `scale(${zoom / 100})`
                }}
              />
              
              <ViewerToolbar>
                <IconButton onClick={handleZoomOut} size="small">
                  <ZoomOutIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  {zoom}%
                </Typography>
                <IconButton onClick={handleZoomIn} size="small">
                  <ZoomInIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <IconButton onClick={handlePrevPage} size="small" disabled={pageNumber === 1}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  Page {pageNumber}
                </Typography>
                <IconButton onClick={handleNextPage} size="small" disabled={pageNumber === 2}>
                  <ChevronRightIcon />
                </IconButton>
              </ViewerToolbar>
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
        <Button onClick={togglePreviewDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
        <Box>
          <Typography>Step 1: Upload your documents</Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload your Document
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
            
            {/* <Card variant="outlined">
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
            </Card> */}
          </Box>
        )
      case 1:
        return <Typography>Step 2: Process your documents</Typography>;
      case 2:
        return <Typography>Step 3: Review and save</Typography>;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  
  
  
  // Steps for document upload process
  const steps = ['Upload Files', 'Process & Extract', 'Review & Save'];
  
  // Check if a case ID was passed from another page
  useEffect(() => {
    if (location.state?.caseId) {
      const caseFromParam = mockCases.find(c => c.id === location.state.caseId);
      if (caseFromParam) {
        setSelectedCase(caseFromParam);
      }
    }
  }, [location.state]);
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Create file objects with preview URLs
      const newFiles = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
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
      const files = Array.from(event.dataTransfer.files);
      
      // Create file objects with preview URLs
      const newFiles = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };
  
  // Prevent default drag behaviors
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  // Handle remove file
  const handleRemoveFile = (index) => {
    const newFiles = [...uploadedFiles];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newFiles[index].preview);
    
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  // Handle document type change
  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };
  
  // Handle document notes change
  const handleDocumentNotesChange = (event) => {
    setDocumentNotes(event.target.value);
  };
  
  // Handle preview dialog open
  const handlePreviewOpen = (file) => {
    setCurrentPreviewFile(file);
    setPreviewDialogOpen(true);
  };
  
  // Handle preview dialog close
  const handlePreviewClose = () => {
    setPreviewDialogOpen(false);
  };
  
  // Handle document processing
  const handleProcessDocuments = () => {
    if (uploadedFiles.length === 0) return;
    
    setProcessingStatus("processing");
    setProcessingProgress(0);
    setCurrentStep('upload');
    
    // Update status of all files to "processing"
    const updatedFiles = uploadedFiles.map(file => ({
      ...file,
      status: 'processing',
      progress: 0
    }));
    
    setUploadedFiles(updatedFiles);
    
    // Simulated processing with steps
    const stepDurations = {
      upload: 1000,
      preprocess: 1500,
      ocr: 3000,
      extraction: 2500,
      classification: 1500,
      validation: 1000
    };
    
    let currentStepIndex = 0;
    const totalDuration = Object.values(stepDurations).reduce((sum, val) => sum + val, 0);
    
    const updateProgress = (elapsed, currentStep) => {
      const progressPercentage = (elapsed / totalDuration) * 100;
      setProcessingProgress(progressPercentage);
      setCurrentStep(currentStep);
      
      // Update progress of individual files
      const newUpdatedFiles = uploadedFiles.map((file, i) => {
        // Simulate different progress for each file
        const fileProgress = progressPercentage + (Math.random() * 10 - 5);
        return {
          ...file,
          progress: Math.min(Math.max(fileProgress, 0), 100),
          status: fileProgress >= 100 ? 'processed' : 'processing'
        };
      });
      
      setUploadedFiles(newUpdatedFiles);
    };
    
    let elapsed = 0;
    const processStep = (stepIndex) => {
      if (stepIndex >= mockProcessingSteps.length) {
        setProcessingStatus("success");
        
        // Update all files to processed status
        const completedFiles = uploadedFiles.map(file => ({
          ...file,
          status: 'processed',
          progress: 100,
          confidence: 85 + Math.random() * 10 // Random confidence between 85-95%
        }));
        
        setUploadedFiles(completedFiles);
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
  
  // Handle save documents
  const handleSaveDocuments = () => {
    // In a real app, this would send the data to the backend
    console.log('Saving documents:', {
      files: uploadedFiles,
      case: selectedCase,
      documentType,
      documentNotes
    });
    
    // Navigate to the document list or the case page
    if (selectedCase) {
      navigate(`/cases/${selectedCase.id}`);
    } else {
      navigate('/document');
    }
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
    setPageNumber(prev => Math.min(prev + 1, 2));
  };
  return (
  <Box>
    {/* Breadcrumb Navigation */}
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link underline="hover" component={RouterLink} to="/">
        <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
      </Link>
      <Link underline="hover" component={RouterLink} to="/document">
        <DescriptionIcon sx={{ mr: 0.5, fontSize: 18 }} /> Documents
      </Link>
      <Typography color="text.primary">Upload</Typography>
    </Breadcrumbs>

    {/* Header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4">Upload Documents</Typography>

      <Box>
        <Button
          variant="outlined"
          startIcon={<FolderOpenIcon />}
          component={RouterLink}
          to="/documents"
          sx={{ mr: 1 }}
        >
          All Documents
        </Button>

        {selectedCase && (
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            component={RouterLink}
            to={`/cases/${selectedCase.id}`}
            sx={{ mr: 1 }}
          >
            View Case
          </Button>
        )}
      </Box>
    </Box>

    {/* Stepper */}
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>

    {/* Display error if no files uploaded */}
    {activeStep === 0 && uploadedFiles.length === 0 && error && (
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    )}

    {/* Step Content */}
    <Box sx={{ mb: 4 }}>
      {getStepContent(activeStep)}
    </Box>

    {/* Navigation Buttons */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
      <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>

      {activeStep === 0 && (
        <Button
          variant="contained"
          onClick={() => {
            if (uploadedFiles.length === 0) {
              setError('Please upload at least one document.');
            } else {
              setError('');
              handleNext();
            }
          }}
          endIcon={<ArrowForwardIcon />}
        >
          Continue
        </Button>
      )}

      {activeStep === 1 && (
        processingStatus !== "success" ? (
          <LoadingButton
            loading={processingStatus === "processing"}
            variant="contained"
            onClick={handleProcessDocuments}
            startIcon={<DocumentScannerIcon />}
            disabled={uploadedFiles.length === 0}
            loadingPosition="start"
          >
            Process Documents
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Review & Save
          </Button>
        )
      )}

      {activeStep === 2 && (
        <Button
          variant="contained"
          onClick={handleSaveDocuments}
          endIcon={<SaveIcon />}
        >
          Save Documents
        </Button>
      )}
    </Box>

    {/* Preview Dialog */}
    <PreviewDialog />

    
  </Box>
);
}
export default DocumentUpload;