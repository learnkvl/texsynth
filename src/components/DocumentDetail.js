// src/components/DocumentDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  Button, 
  Divider, 
  Chip,
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slider,
  Stack,
  styled,
  Alert,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


// Icons
import RedactionIcon from '@mui/icons-material/FormatColorFill';
import HighlightIcon from '@mui/icons-material/Highlight';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import PrintIcon from '@mui/icons-material/Print';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoIcon from '@mui/icons-material/Info';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// PDF rendering components would be imported here
// import { Document, Page } from 'react-pdf';

// Styled components for specialized UI elements
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

const DocumentViewerPane = styled(Paper)(({ theme }) => ({
  height: '75vh',
  overflow: 'auto',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
}));

const MetadataItem = ({ icon, label, value, color, copyable = false }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        {React.cloneElement(icon, { fontSize: 'small', color: color || 'inherit' })}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {value || 'N/A'}
            </Typography>
            {copyable && value && (
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopy} 
                  sx={{ ml: 0.5, color: copied ? 'success.main' : 'action.active' }}
                >
                  {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        disableTypography
      />
    </ListItem>
  );
};

function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [highlightMode, setHighlightMode] = useState(false);
  const [redactMode, setRedactMode] = useState(false);

  // Toggle menu
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  // Page navigation
  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  // Toggle highlighting/redaction modes
  const toggleHighlightMode = () => {
    setHighlightMode(prev => !prev);
    if (redactMode) setRedactMode(false);
  };

  const toggleRedactMode = () => {
    setRedactMode(prev => !prev);
    if (highlightMode) setHighlightMode(false);
  };

  // Fetch document data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Mock data fetch with timeout
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
        setOcrText("Account Statement\nBig Bank Inc.\nAccount: ACCT-12345-789\nDate: 01/15/2025\nPayment Due: 02/10/2025\nAmount Due: $123.45\nPrincipal: $100.00\nInterest: $23.45\nPayment Address:\nBig Bank Inc.\nP.O. Box 123456\nNew York, NY 10001\n\nTransaction History:\nDate       Description                 Amount\n12/15/2024 Previous Balance             $120.00\n12/20/2024 Payment - Thank You         -$120.00\n01/05/2025 Purchase - Retail Store      $85.00\n01/10/2025 Interest Charge              $15.45\n01/12/2025 Service Fee                   $3.00\n\nCurrent Balance: $123.45\n\nImportant Notice: Payment is due by 02/10/2025. Late payments may result in additional fees.\n\nFor customer service: 1-800-123-4567 or visit www.bigbankinc.com");
        setNumPages(2);
      } else {
        setError("Document not found (mock data).");
      }
      setIsLoading(false);
    }, 1500);
  }, [id]);

  // Content for different tabs
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Document Tab
        return (
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* PDF Document would be rendered here
              <Document
                file={`/api/documents/${id}/file`}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<CircularProgress />}
                error={<Typography color="error">Failed to load PDF document</Typography>}
              >
                <Page
                  pageNumber={pageNumber}
                  width={zoom * 6.5}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            */}
            
            {/* Mock PDF Placeholder */}
            <Box sx={{ 
              height: '100%', 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              position: 'relative',
              transform: `scale(${zoom/100})`,
              transition: 'transform 0.3s ease'
            }}>
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
                  flexDirection: 'column'
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
                
                <Box sx={{ 
                  mb: 3,
                }}>
                  <Box sx={{ fontWeight: 'bold', mb: 1 }}>Transaction History</Box>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: '#f0f0f0',
                        textAlign: 'left',
                        fontSize: '12px'
                      }}>
                        <th style={{ padding: '4px' }}>Date</th>
                        <th style={{ padding: '4px' }}>Description</th>
                        <th style={{ padding: '4px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px' }}>12/15/2024</td>
                        <td style={{ padding: '4px' }}>Previous Balance</td>
                        <td style={{ padding: '4px', textAlign: 'right' }}>$120.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px' }}>12/20/2024</td>
                        <td style={{ padding: '4px' }}>Payment - Thank You</td>
                        <td style={{ padding: '4px', textAlign: 'right' }}>-$120.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px' }}>01/05/2025</td>
                        <td style={{ padding: '4px' }}>Purchase - Retail Store</td>
                        <td style={{ padding: '4px', textAlign: 'right' }}>$85.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px' }}>01/10/2025</td>
                        <td style={{ padding: '4px' }}>Interest Charge</td>
                        <td style={{ padding: '4px', textAlign: 'right' }}>$15.45</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px' }}>01/12/2025</td>
                        <td style={{ padding: '4px' }}>Service Fee</td>
                        <td style={{ padding: '4px', textAlign: 'right' }}>$3.00</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
                
                <Box sx={{ mt: 'auto', borderTop: '1px solid #eee', pt: 2, fontSize: '12px' }}>
                  <Box>For customer service: 1-800-123-4567 or visit www.bigbankinc.com</Box>
                  <Box>Page {pageNumber} of {numPages}</Box>
                </Box>
              </Paper>
              
              {highlightMode && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    boxShadow: 3
                  }}
                  action={
                    <Button size="small" onClick={toggleHighlightMode}>
                      Exit Mode
                    </Button>
                  }
                >
                  Highlight Mode Active - Click and drag to highlight text
                </Alert>
              )}
              
              {redactMode && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    boxShadow: 3
                  }}
                  action={
                    <Button size="small" onClick={toggleRedactMode}>
                      Exit Mode
                    </Button>
                  }
                >
                  Redaction Mode Active - Click and drag to redact information
                </Alert>
              )}
            </Box>
            
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
                    {pageNumber} / {numPages || 1}
                  </Typography>
                  <Tooltip title="Next Page">
                    <IconButton 
                      size="small" 
                      color="inherit" 
                      onClick={handleNextPage}
                      disabled={pageNumber >= (numPages || 1)}
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
                    onChange={handleZoomChange}
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
                  <Tooltip title={highlightMode ? "Exit Highlight Mode" : "Highlight Text"}>
                    <IconButton 
                      size="small" 
                      color={highlightMode ? "warning" : "inherit"}
                      onClick={toggleHighlightMode}
                    >
                      <HighlightIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={redactMode ? "Exit Redaction Mode" : "Redact Information"}>
                    <IconButton 
                      size="small" 
                      color={redactMode ? "error" : "inherit"}
                      onClick={toggleRedactMode}
                    >
                      <RedactionIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Print Document">
                    <IconButton size="small" color="inherit">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Original">
                    <IconButton size="small" color="inherit">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </ViewerToolbar>
          </Box>
        );
      
      case 1: // OCR Text Tab
        return (
          <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Extracted Text (OCR)
            </Typography>
            <Button 
              size="small" 
              startIcon={<ContentCopyIcon />} 
              sx={{ mb: 2 }} 
              onClick={() => {
                navigator.clipboard.writeText(ocrText);
              }}
            >
              Copy to Clipboard
            </Button>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                backgroundColor: 'background.default',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            >
              {ocrText || 'No OCR text available.'}
            </Paper>
          </Box>
        );
      
      case 2: // Extracted Data Tab
        return (
          <Box sx={{ height: '100%', overflowY: 'auto' }}>
            <Stack spacing={2}>
              <Card variant="outlined">
                <CardHeader 
                  title="Financial Information" 
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<AttachMoneyIcon />} 
                        label="Total Amount"
                        value={docData?.amount ? `${docData.amount.toFixed(2)}` : null}
                        color="success"
                        copyable
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<AttachMoneyIcon />} 
                        label="Principal"
                        value={docData?.principal ? `${docData.principal.toFixed(2)}` : null}
                        copyable
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<AttachMoneyIcon />} 
                        label="Interest"
                        value={docData?.interest ? `${docData.interest.toFixed(2)}` : null}
                        copyable
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<EventIcon />} 
                        label="Due Date"
                        value={docData?.dueDate || null}
                        copyable
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card variant="outlined">
                <CardHeader 
                  title="Account Information" 
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<CreditCardIcon />} 
                        label="Account Number"
                        value={docData?.accountNumber || null}
                        color="primary"
                        copyable
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<AccountBalanceIcon />} 
                        label="Creditor"
                        value={docData?.creditor || null}
                        copyable
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<AssignmentLateIcon />} 
                        label="Default Date"
                        value={docData?.defaultDate || 'Not in default'}
                        color={docData?.defaultDate ? "error" : "success"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<DescriptionIcon />} 
                        label="Document Type"
                        value={docData?.type || null}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card variant="outlined">
                <CardHeader 
                  title="Document Metadata" 
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<EventIcon />} 
                        label="Document Date"
                        value={docData?.date || null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<EventIcon />} 
                        label="Upload Date"
                        value={docData?.uploadDate || null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<DescriptionIcon />} 
                        label="File Size"
                        value={docData?.fileSize || null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MetadataItem 
                        icon={<DescriptionIcon />} 
                        label="Page Count"
                        value={docData?.pageCount ? `${docData.pageCount} pages` : null}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Alert 
                      severity={docData?.confidence > 0.9 ? "success" : "warning"}
                      icon={docData?.confidence > 0.9 ? <CheckCircleIcon /> : <WarningIcon />}
                    >
                      <Typography variant="body2">
                        OCR Confidence: <strong>{docData?.confidence ? `${(docData.confidence * 100).toFixed(0)}%` : 'N/A'}</strong>
                        {docData?.confidence && docData.confidence < 0.9 && (
                          <span> — Some extracted data may require manual verification</span>
                        )}
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        );
      
      default:
        return null;
    }
  };

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

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6">Error</Typography>
        <Typography variant="body1">{error}</Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Document Search
        </Button>
      </Alert>
    );
  }

  if (!docData) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        <Typography variant="h6">Document Not Found</Typography>
        <Typography variant="body1">The requested document could not be found or accessed.</Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Document Search
        </Button>
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
          Search
        </Link>
        <Typography color="text.primary">{docData.name}</Typography>
      </Breadcrumbs>
      
      {/* Document Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>{docData.name}</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              icon={<DescriptionIcon />}
              label={docData.type} 
              color="primary" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              icon={<EventIcon />}
              label={`Date: ${docData.date}`} 
              variant="outlined" 
              size="small"
            />
            <Chip 
              icon={<AccountBalanceIcon />}
              label={`Creditor: ${docData.creditor}`} 
              variant="outlined" 
              size="small"
            />
            {docData.amount && (
              <Chip 
                icon={<AttachMoneyIcon />}
                label={`Amount: ${docData.amount.toFixed(2)}`} 
                variant="outlined" 
                size="small"
                color={docData.amount > 500 ? "error" : "default"}
              />
            )}
          </Stack>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ mr: 1 }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            endIcon={<MoreVertIcon />}
          >
            Actions
          </Button>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Add to Case</MenuItem>
            <MenuItem onClick={handleMenuClose}>Print Document</MenuItem>
            <MenuItem onClick={handleMenuClose}>Create Note</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Delete Document</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Document Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '77vh', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {/* Tabs */}
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<DescriptionIcon />} 
            iconPosition="start" 
            label="Document" 
            id="document-tab" 
          />
          <Tab 
            icon={<TextSnippetIcon />} 
            iconPosition="start" 
            label="OCR Text" 
            id="ocr-tab" 
          />
          <Tab 
            icon={<InfoIcon />} 
            iconPosition="start" 
            label="Extracted Data" 
            id="data-tab" 
          />
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default DocumentDetail;