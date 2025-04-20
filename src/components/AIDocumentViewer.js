// src/components/AIDocumentViewer.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Divider, 
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Badge
} from '@mui/material';

// Import icons
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// Document viewer toolbar component
const ViewerToolbar = ({ pageNumber, numPages, zoom, handleZoomIn, handleZoomOut, handlePrevPage, handleNextPage }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      zIndex: 10,
    }}
  >
    <IconButton
      color="inherit"
      onClick={handlePrevPage}
      disabled={pageNumber <= 1}
      size="small"
    >
      <NavigateBeforeIcon />
    </IconButton>
    
    <Typography variant="body2" sx={{ mx: 1 }}>
      {pageNumber} / {numPages || 1}
    </Typography>
    
    <IconButton
      color="inherit"
      onClick={handleNextPage}
      disabled={pageNumber >= numPages}
      size="small"
    >
      <NavigateNextIcon />
    </IconButton>
    
    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
    
    <IconButton color="inherit" onClick={handleZoomOut} size="small">
      <ZoomOutIcon />
    </IconButton>
    
    <Typography variant="body2" sx={{ mx: 1 }}>
      {zoom}%
    </Typography>
    
    <IconButton color="inherit" onClick={handleZoomIn} size="small">
      <ZoomInIcon />
    </IconButton>
    
    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
    
    <Button size="small" color="inherit" startIcon={<LightbulbIcon />}>
      Key Points
    </Button>
  </Box>
);

// Extraction highlight component
const ExtractionHighlight = ({ top, left, right, width, confidence, type, value, onEdit }) => {
  // Determine color based on type
  const getColorByType = (type) => {
    switch (type) {
      case 'accountNumber':
        return '#2196f3'; // blue
      case 'amount':
        return '#4caf50'; // green
      case 'date':
        return '#9c27b0'; // purple
      case 'creditor':
        return '#ff9800'; // orange
      default:
        return '#757575'; // gray
    }
  };
  
  // Determine border style based on confidence
  const getBorderStyle = (confidence) => {
    if (confidence >= 90) return 'solid';
    if (confidence >= 70) return 'dashed';
    return 'dotted';
  };
  
  const color = getColorByType(type);
  const borderStyle = getBorderStyle(confidence);
  
  return (
    <Tooltip
      title={`${value} (${confidence}% confidence)`}
      placement="top"
    >
      <Box
        sx={{
          position: 'absolute',
          top,
          ...(left ? { left } : {}),
          ...(right ? { right } : {}),
          ...(width ? { width } : {}),
          border: `2px ${borderStyle} ${color}`,
          borderRadius: '4px',
          padding: '2px 4px',
          background: `${color}10`,
          cursor: 'pointer',
          '&:hover': {
            background: `${color}30`,
          }
        }}
        onClick={onEdit}
      >
        {value}
      </Box>
    </Tooltip>
  );
};

// Main AI document viewer component
function AIDocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(2);
  const [zoom, setZoom] = useState(100);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  
  // Handle zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  
  // Handle page navigation
  const handlePrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  
  // Handle settings menu
  const handleSettingsOpen = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);
  
  // Toggle AI features
  const handleToggleAI = () => setAiEnabled(!aiEnabled);
  
  // Mock data for testing
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to get document data
    setTimeout(() => {
      if (id === 'doc1') {
        setDocData({
          id: 'doc1',
          name: 'ACC_12345_Statement_Jan2025.pdf',
          type: 'Account Statement',
          date: '2025-01-15',
          creditor: 'Big Bank Inc.',
          amount: 123.45,
          principal: 100.00,
          interest: 23.45,
          defaultDate: null,
          chargeOffDate: null,
          accountNumber: 'ACCT-12345-789',
          dueDate: '2025-02-10',
          pageCount: 2,
          fileSize: '156KB',
          uploadDate: '2025-01-18',
          status: 'Active',
          confidence: 0.95
        });
        setNumPages(2);
      } else {
        // Handle error case
        setDocData(null);
      }
      setIsLoading(false);
      
      // Simulate AI processing delay
      setTimeout(() => {
        // Set extracted data
        setExtractedData([
          { field: 'Account Number', value: 'ACCT-12345-789', confidence: 98, type: 'accountNumber', position: { top: '120px', left: '250px' } },
          { field: 'Amount Due', value: '$123.45', confidence: 85, type: 'amount', position: { top: '180px', right: '150px' } },
          { field: 'Due Date', value: '02/10/2025', confidence: 92, type: 'date', position: { top: '150px', right: '150px' } },
          { field: 'Creditor', value: 'Big Bank Inc.', confidence: 99, type: 'creditor', position: { top: '90px', left: '250px' } },
          { field: 'Principal', value: '$100.00', confidence: 78, type: 'amount', position: { top: '210px', right: '150px' } },
          { field: 'Interest', value: '$23.45', confidence: 81, type: 'amount', position: { top: '240px', right: '150px' } }
        ]);
        
        // Set suggestions
        setSuggestions([
          { 
            text: 'This appears to be the most recent statement in a series of 3 statements.',
            action: 'View Related Documents',
            severity: 'info' 
          },
          { 
            text: 'This account is 15 days past the payment due date.',
            action: 'Add to Collection Priority',
            severity: 'error' 
          },
          { 
            text: 'The interest rate (15.6%) exceeds the average for similar accounts (12.3%).',
            action: 'Flag for Review',
            severity: 'warning' 
          }
        ]);
        
        // Set related documents
        setRelatedDocuments([
          { id: 'doc2', name: 'ACC_12345_Statement_Dec2024.pdf', type: 'Account Statement', match: 99 },
          { id: 'doc3', name: 'ACC_12345_Notice_Dec2024.pdf', type: 'Collection Notice', match: 95 },
          { id: 'doc4', name: 'ACC_12345_Agreement.pdf', type: 'Credit Agreement', match: 87 }
        ]);
        
        setAiInsightsLoading(false);
      }, 1500);
    }, 1000);
  }, [id]);
  
  // Handle verification of all extractions
  const handleVerifyAll = () => {
    console.log('Verifying all extractions');
    // In a real app, this would call an API to verify all items
    
    // Show success message
    alert('All extractions verified successfully!');
  };
  
  // Handle editing extraction
  const handleEditExtraction = (index) => {
    console.log('Editing extraction:', extractedData[index]);
    // In a real app, this would open an edit dialog
    
    // For demo, just show an alert
    alert(`Editing: ${extractedData[index].field}`);
  };
  
  // Calculate number of low confidence items
  const lowConfidenceItems = extractedData.filter(item => item.confidence < 90).length;

  // Render loading state
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading document...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (!docData) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6">Document Not Found</Typography>
        <Typography variant="body1">The requested document could not be found or accessed.</Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Search
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with AI toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{docData.name}</Typography>
        
        <Box>
          <FormControlLabel
            control={
              <Switch 
                checked={aiEnabled} 
                onChange={handleToggleAI}
                color="primary"
              />
            }
            label="AI Insights"
          />
          
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={handleSettingsOpen}
            sx={{ ml: 1 }}
          >
            AI Settings
          </Button>
          
          <Menu
            anchorEl={settingsAnchorEl}
            open={Boolean(settingsAnchorEl)}
            onClose={handleSettingsClose}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Confidence Threshold
            </Typography>
            <MenuItem>
              <FormControlLabel
                control={<Switch size="small" checked />}
                label="Show high confidence (90%+)"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={<Switch size="small" checked />}
                label="Show medium confidence (70-90%)"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={<Switch size="small" checked={false} />}
                label="Show low confidence (<70%)"
              />
            </MenuItem>
            <Divider />
            <MenuItem>
              <FormControlLabel
                control={<Switch size="small" checked />}
                label="Highlight extractions"
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Main content area with document viewer and AI sidebar */}
      <Box sx={{ display: 'flex', height: '80vh', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {/* Document viewer */}
        <Box sx={{ flex: 7, position: 'relative', borderRight: aiEnabled ? 1 : 0, borderColor: 'divider' }}>
          {/* Mock document display with extraction highlights */}
          <Box 
            sx={{ 
              height: '100%',
              position: 'relative',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'auto'
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                width: 595, 
                height: 842, 
                maxHeight: '90%',
                p: 4,
                m: 2,
                position: 'relative',
                backgroundColor: '#fff',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                transform: `scale(${zoom/100})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                ACCOUNT STATEMENT
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 3,
              }}>
                <Box>
                  <Box sx={{ fontWeight: 'bold' }}>Big Bank Inc.</Box>
                  <Box>P.O. Box 123456</Box>
                  <Box>New York, NY 10001</Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box>Statement Date: 01/15/2025</Box>
                  <Box>Account Number: ACCT-12345-789</Box>
                  <Box>Payment Due: 02/10/2025</Box>
                </Box>
              </Box>
              
              <Box sx={{ 
                mb: 3,
                p: 2,
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
              }}>
                <Box sx={{ fontWeight: 'bold' }}>Account Summary</Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Previous Balance:</Box>
                  <Box>$120.00</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Payments and Credits:</Box>
                  <Box>-$120.00</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Purchases and Debits:</Box>
                  <Box>$88.00</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Interest Charged:</Box>
                  <Box>$15.45</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Fees:</Box>
                  <Box>$20.00</Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Box>Current Balance:</Box>
                  <Box>$123.45</Box>
                </Box>
              </Box>
              
              <Box sx={{ mt: 'auto', borderTop: '1px solid #eee', pt: 2, fontSize: '12px' }}>
                <Box>For customer service: 1-800-123-4567 or visit www.bigbankinc.com</Box>
                <Box>Page {pageNumber} of {numPages}</Box>
              </Box>
              
              {/* AI extraction overlays - only show when AI is enabled */}
              {aiEnabled && extractedData.map((extraction, index) => (
                <ExtractionHighlight
                  key={`${extraction.field}-${index}`}
                  top={extraction.position.top}
                  left={extraction.position.left}
                  right={extraction.position.right}
                  width={extraction.width}
                  confidence={extraction.confidence}
                  type={extraction.type}
                  value={extraction.value}
                  onEdit={() => handleEditExtraction(index)}
                />
              ))}
            </Paper>
            
            {/* Document viewer controls */}
            <ViewerToolbar
              pageNumber={pageNumber}
              numPages={numPages}
              zoom={zoom}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </Box>
        </Box>
        
        {/* AI sidebar - only show when AI is enabled */}
        {aiEnabled && (
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                AI Insights
                {lowConfidenceItems > 0 && (
                  <Chip 
                    label={`${lowConfidenceItems} need review`} 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </Typography>
              
              <IconButton size="small" onClick={handleToggleAI}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {aiInsightsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <>
                  {/* Extracted information section */}
                  <Typography variant="subtitle2" gutterBottom>
                    Extracted Information
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    {extractedData.map((item, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: item.confidence < 90 ? 'rgba(255, 152, 0, 0.08)' : 'transparent'
                        }}
                      >
                        <Typography variant="body2">{item.field}:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium">{item.value}</Typography>
                          <Chip 
                            label={`${item.confidence}%`} 
                            size="small" 
                            color={item.confidence >= 90 ? "success" : item.confidence >= 70 ? "warning" : "error"} 
                            sx={{ ml: 1, height: 20 }} 
                          />
                          <IconButton size="small" onClick={() => handleEditExtraction(index)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* AI suggestions section */}
                  <Typography variant="subtitle2" gutterBottom>Suggestions</Typography>
                  
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    {suggestions.map((suggestion, index) => (
                      <Card 
                        key={index} 
                        variant="outlined" 
                        sx={{ 
                          backgroundColor: 'background.default',
                          borderColor: suggestion.severity === 'error' ? 'error.main' : 
                                      suggestion.severity === 'warning' ? 'warning.main' : 
                                      'divider'
                        }}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography 
                            variant="body2" 
                            color={suggestion.severity === 'error' ? 'error' : 
                                  suggestion.severity === 'warning' ? 'warning.main' : 
                                  'text.primary'}
                          >
                            {suggestion.text}
                          </Typography>
                          <Button size="small" sx={{ mt: 1 }}>
                            {suggestion.action}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Related documents section */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2">Related Documents</Typography>
                    <Button size="small" endIcon={<KeyboardArrowDownIcon />}>View All</Button>
                  </Box>
                  
                  <Stack spacing={1}>
                    {relatedDocuments.map((doc, index) => (
                      <Paper 
                        key={index} 
                        variant="outlined" 
                        sx={{ 
                          p: 1.5, 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doc.type}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={`${doc.match}%`} 
                            size="small" 
                            color={doc.match >= 95 ? "success" : "primary"} 
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <IconButton size="small" onClick={() => navigate(`/document/${doc.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
            
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<CheckIcon />}
                onClick={handleVerifyAll}
                disabled={aiInsightsLoading}
              >
                Verify All Extractions
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AIDocumentViewer;