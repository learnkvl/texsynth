// src/components/document/DocumentProcessor.jsx
import React, { useState, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  LinearProgress,
  CircularProgress,
  IconButton,
  Alert,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import TuneIcon from '@mui/icons-material/Tune';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

// Styled components for the document viewer
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

const ProcessingStep = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 
    status === 'completed' ? theme.palette.success.light :
    status === 'active' ? theme.palette.primary.light : 
    status === 'error' ? theme.palette.error.light :
    'transparent',
  opacity: status === 'pending' ? 0.6 : 1
}));

// Mock data for document processing
const processingSteps = [
  { id: 'upload', label: 'Document Upload', status: 'completed' },
  { id: 'preprocess', label: 'Image Pre-processing', status: 'completed' },
  { id: 'ocr', label: 'OCR Processing', status: 'completed' },
  { id: 'extraction', label: 'Field Extraction', status: 'active' },
  { id: 'classification', label: 'Document Classification', status: 'pending' },
  { id: 'validation', label: 'Data Validation', status: 'pending' }
];

// Mock extracted data from document
const extractedData = {
  confidence: 89.7,
  documentType: 'Collection Notice',
  accountDetails: {
    accountNumber: 'ACC-12345-6789',
    originalCreditor: 'First National Bank',
    currentOwner: 'Johnson & Partners LLP',
    openingDate: '2022-04-15',
    defaultDate: '2024-07-25',
    chargeOffDate: '2024-10-03'
  },
  debtorInfo: {
    name: 'Jane A. Doe',
    address: '123 Main St, Anytown, US 12345',
    phone: '555-123-4567',
    email: 'janedoe@example.com'
  },
  financialData: {
    principalAmount: 2450.00,
    interestAmount: 245.75,
    feesAmount: 75.00,
    totalAmount: 2770.75
  },
  paymentHistory: [
    { date: '2023-12-15', type: 'Payment', amount: 150.00 },
    { date: '2024-01-20', type: 'Payment', amount: 150.00 },
    { date: '2024-02-15', type: 'Late Fee', amount: -25.00 },
    { date: '2024-03-10', type: 'Payment', amount: 150.00 },
    { date: '2024-06-05', type: 'Late Fee', amount: -25.00 }
  ],
  legalNotices: [
    "This is an attempt to collect a debt and any information obtained will be used for that purpose.",
    "You have 30 days from receipt of this notice to dispute the validity of this debt."
  ],
  entities: [
    { id: 1, type: 'account', text: 'ACC-12345-6789', position: { top: '10%', left: '40%', width: '25%', height: '3%' }, confidence: 96.5 },
    { id: 2, type: 'date', text: '2024-10-03', position: { top: '15%', left: '50%', width: '15%', height: '3%' }, confidence: 92.3 },
    { id: 3, type: 'amount', text: '$2,450.00', position: { top: '25%', left: '60%', width: '12%', height: '3%' }, confidence: 98.1 },
    { id: 4, type: 'entity', text: 'Jane A. Doe', position: { top: '20%', left: '25%', width: '20%', height: '3%' }, confidence: 94.7 },
    { id: 5, type: 'entity', text: 'First National Bank', position: { top: '30%', left: '30%', width: '30%', height: '3%' }, confidence: 89.5 },
    { id: 6, type: 'date', text: '2024-07-25', position: { top: '35%', left: '55%', width: '15%', height: '3%' }, confidence: 90.2 },
    { id: 7, type: 'amount', text: '$245.75', position: { top: '40%', left: '60%', width: '10%', height: '3%' }, confidence: 95.8 },
    { id: 8, type: 'amount', text: '$2,770.75', position: { top: '45%', left: '60%', width: '12%', height: '3%' }, confidence: 97.2 }
  ],
  tables: [
    {
      name: 'Payment History',
      position: { top: '55%', left: '20%', width: '60%', height: '15%' },
      confidence: 88.5,
      rows: 5,
      columns: 3
    }
  ]
};

// Document classifications
const documentClasses = [
  { id: 'collection_notice', name: 'Collection Notice', confidence: 92.8, description: 'Initial or follow-up notification of debt collection' },
  { id: 'account_statement', name: 'Account Statement', confidence: 75.3, description: 'Statement of account activity and balance' },
  { id: 'credit_agreement', name: 'Credit Agreement', confidence: 32.1, description: 'Original terms of credit' },
  { id: 'legal_filing', name: 'Legal Filing', confidence: 12.5, description: 'Court documents related to collection' },
  { id: 'payment_receipt', name: 'Payment Receipt', confidence: 5.2, description: 'Proof of payment received' }
];

// Define the component
const DocumentProcessor = ({ document, onProcessComplete }) => {
  const theme = useTheme();
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showHighlights, setShowHighlights] = useState(true);
  const [showEntityDialog, setShowEntityDialog] = useState(false);
  const [highlightedCategories, setHighlightedCategories] = useState({
    account: true,
    date: true,
    amount: true,
    entity: true
  });
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [advancedSettings, setAdvancedSettings] = useState(false);

  // Start processing on component mount
  useEffect(() => {
    if (document && !isComplete) {
      startProcessing();
    }
  }, [document]);

  // Handle processing simulation
  const startProcessing = () => {
    setProcessing(true);
    setProcessingProgress(0);
    setCurrentStep('upload');
    
    // Simulated processing with steps
    const stepDurations = {
      upload: 2000,
      preprocess: 3000,
      ocr: 5000,
      extraction: 4000,
      classification: 3000,
      validation: 2000
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
      if (stepIndex >= processingSteps.length) {
        setProcessing(false);
        setIsComplete(true);
        if (onProcessComplete) {
          onProcessComplete(extractedData);
        }
        return;
      }
      
      const step = processingSteps[stepIndex];
      setCurrentStep(step.id);
      
      setTimeout(() => {
        elapsed += stepDurations[step.id];
        updateProgress(elapsed, step.id);
        processStep(stepIndex + 1);
      }, stepDurations[step.id]);
    };
    
    processStep(0);
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
  const handleConfidenceChange = (event) => {
    setConfidenceThreshold(Number(event.target.value));
  };

  // Filter entities based on confidence threshold and selected categories
  const getFilteredEntities = () => {
    return extractedData.entities.filter(entity => 
      entity.confidence >= confidenceThreshold && 
      highlightedCategories[entity.type]
    );
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = () => {
    setAdvancedSettings(!advancedSettings);
  };

  // Reset processing
  const handleReset = () => {
    setIsComplete(false);
    setProcessing(false);
    setProcessingProgress(0);
    setCurrentStep('');
    setSelectedEntity(null);
  };

  // Restart processing
  const handleRestart = () => {
    handleReset();
    startProcessing();
  };
  
  // Get step status icon
  const getStepStatusIcon = (stepId) => {
    const step = processingSteps.find(s => s.id === stepId);
    if (!step) return null;
    
    switch(step.status) {
      case 'completed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'active':
        return <CircularProgress size={16} />;
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  // Entity dialog content
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
          Entity Details
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
                  {selectedEntity.text}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Entity Type
              </Typography>
              <Chip 
                label={selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1)}
                color={
                  selectedEntity.type === 'account' ? 'primary' :
                  selectedEntity.type === 'date' ? 'secondary' :
                  selectedEntity.type === 'amount' ? 'success' :
                  selectedEntity.type === 'entity' ? 'warning' : 'default'
                }
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Confidence Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {selectedEntity.confidence.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedEntity.confidence} 
                  color={
                    selectedEntity.confidence > 90 ? 'success' :
                    selectedEntity.confidence > 80 ? 'primary' :
                    selectedEntity.confidence > 70 ? 'warning' : 'error'
                  }
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
                    value={selectedEntity.position.top}
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
                    value={selectedEntity.position.left}
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
                    value={selectedEntity.position.width}
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
                    value={selectedEntity.position.height}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Suggested Categories
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="Text" />
                <Chip size="small" label="Financial Data" color="success" />
                <Chip size="small" label="Entity Name" color="primary" />
              </Stack>
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
      {/* Document Processing Progress */}
      {processing && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Processing Document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(processingProgress)}% Complete
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={processingProgress} 
              sx={{ height: 8, borderRadius: 1, mb: 3 }}
            />
            
            <Grid container spacing={2}>
              {processingSteps.map((step) => (
                <Grid item xs={12} sm={6} md={4} key={step.id}>
                  <ProcessingStep 
                    status={
                      currentStep === step.id ? 'active' :
                      processingSteps.findIndex(s => s.id === step.id) < processingSteps.findIndex(s => s.id === currentStep) ? 'completed' :
                      'pending'
                    }
                  >
                    {currentStep === step.id ? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ) : processingSteps.findIndex(s => s.id === step.id) < processingSteps.findIndex(s => s.id === currentStep) ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <Box sx={{ width: 20, height: 20, mr: 1 }} />
                    )}
                    <Typography variant="body2">
                      {step.label}
                    </Typography>
                  </ProcessingStep>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {/* Document Analysis Controls */}
      {isComplete && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Document Analysis
              </Typography>
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Processing Complete" 
                color="success" 
                variant="outlined"
              />
            </Box>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              Document successfully processed with {extractedData.confidence.toFixed(1)}% overall confidence
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Document Type
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {extractedData.documentType}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Entities Extracted
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DataObjectIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {extractedData.entities.length}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tables Detected
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TuneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {extractedData.tables.length}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    OCR Confidence
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AutoAwesomeIcon 
                      color={
                        extractedData.confidence > 90 ? 'success' :
                        extractedData.confidence > 80 ? 'primary' :
                        extractedData.confidence > 70 ? 'warning' : 'error'
                      } 
                      sx={{ mr: 1 }} 
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {extractedData.confidence.toFixed(1)}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={showHighlights} 
                    onChange={() => setShowHighlights(!showHighlights)}
                    color="primary"
                  />
                } 
                label="Show Detected Entities" 
              />
              
              <Button 
                size="small" 
                startIcon={<TuneIcon />}
                onClick={toggleAdvancedSettings}
                sx={{ ml: 2 }}
              >
                {advancedSettings ? 'Hide Settings' : 'Show Settings'}
              </Button>
            </Box>
            
            {advancedSettings && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Highlight Settings
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Entity Types
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label="Account" 
                          color="primary" 
                          variant={highlightedCategories.account ? "filled" : "outlined"}
                          onClick={() => handleToggleHighlight('account')}
                          size="small"
                        />
                        <Chip 
                          label="Date" 
                          color="secondary" 
                          variant={highlightedCategories.date ? "filled" : "outlined"}
                          onClick={() => handleToggleHighlight('date')}
                          size="small"
                        />
                        <Chip 
                          label="Amount" 
                          color="success" 
                          variant={highlightedCategories.amount ? "filled" : "outlined"}
                          onClick={() => handleToggleHighlight('amount')}
                          size="small"
                        />
                        <Chip 
                          label="Entity" 
                          color="warning" 
                          variant={highlightedCategories.entity ? "filled" : "outlined"}
                          onClick={() => handleToggleHighlight('entity')}
                          size="small"
                        />
                      </Stack>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      Confidence Threshold: {confidenceThreshold}%
                    </Typography>
                    <Box sx={{ width: '100%', pr: 2 }}>
                      <Slider
                        value={confidenceThreshold}
                        onChange={handleConfidenceChange}
                        aria-labelledby="confidence-threshold-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={50}
                        max={100}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Document Viewer and Results */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Document</Typography>
              </Box>
              
              <DocumentViewPort>
                {/* Simulated document image */}
                <img 
                  src="/api/placeholder/600/800" 
                  alt="Document preview placeholder" 
                  style={{ maxWidth: '100%', maxHeight: '95%', objectFit: 'contain' }}
                />
                
                {/* Highlight overlays for detected entities */}
                {isComplete && showHighlights && getFilteredEntities().map(entity => (
                  <HighlightBox
                    key={entity.id}
                    type={entity.type}
                    sx={{
                      top: entity.position.top,
                      left: entity.position.left,
                      width: entity.position.width,
                      height: entity.position.height
                    }}
                    onClick={() => handleEntityClick(entity)}
                  />
                ))}
                
                {/* Table overlays */}
                {isComplete && showHighlights && extractedData.tables.map((table, index) => (
                  <HighlightBox
                    key={`table-${index}`}
                    type="default"
                    sx={{
                      top: table.position.top,
                      left: table.position.left,
                      width: table.position.width,
                      height: table.position.height,
                      border: '2px dashed',
                      backgroundColor: 'transparent'
                    }}
                  />
                ))}
              </DocumentViewPort>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Classification
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documentClasses.sort((a, b) => b.confidence - a.confidence).map((docClass) => (
                      <TableRow 
                        key={docClass.id}
                        sx={{ 
                          backgroundColor: docClass.confidence > 90 ? alpha(theme.palette.success.light, 0.2) : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {docClass.confidence > 90 && (
                              <Tooltip title="Best Match">
                                <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                              </Tooltip>
                            )}
                            <Typography variant={docClass.confidence > 90 ? "subtitle2" : "body2"}>
                              {docClass.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${docClass.confidence.toFixed(1)}%`}
                            size="small"
                            color={
                              docClass.confidence > 90 ? 'success' :
                              docClass.confidence > 70 ? 'primary' :
                              docClass.confidence > 40 ? 'warning' : 'default'
                            }
                            variant={docClass.confidence > 90 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Extracted Information
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Account Details</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.accountNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Original Creditor
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.originalCreditor}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Current Owner
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.currentOwner}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Opening Date
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.openingDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Default Date
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.defaultDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Charge-Off Date
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.accountDetails.chargeOffDate}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Debtor Information</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.debtorInfo.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.debtorInfo.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.debtorInfo.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {extractedData.debtorInfo.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Financial Information</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Principal Amount
                      </Typography>
                      <Typography variant="body2">
                        ${extractedData.financialData.principalAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Interest Amount
                      </Typography>
                      <Typography variant="body2">
                        ${extractedData.financialData.interestAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Fees Amount
                      </Typography>
                      <Typography variant="body2">
                        ${extractedData.financialData.feesAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="subtitle2" color="error">
                        ${extractedData.financialData.totalAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Payment History</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {extractedData.paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.type}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: payment.amount > 0 ? 'success.main' : 'error.main'
                            }}>
                              ${Math.abs(payment.amount).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GavelIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Legal Notices</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {extractedData.legalNotices.map((notice, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <InfoIcon fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={notice}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRestart}
                >
                  Reprocess
                </Button>
                
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    sx={{ mr: 1 }}
                  >
                    Export Data
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<SystemUpdateAltIcon />}
                  >
                    Save to Case
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Entity Detail Dialog */}
      <EntityDialog />
    </Box>
  )
}
export default DocumentProcessor;