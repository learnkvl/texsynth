// src/components/invoicing/InvoiceCreation.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  IconButton, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  InputAdornment,
  Card,
  CardContent,
  CardHeader,
  Autocomplete,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TemplateIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WarningIcon from '@mui/icons-material/Warning';

// Material UI List Components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Material UI Icons
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';

// Mock data for clients/debtors
const clients = [
  { id: 1, name: 'Johnson & Partners LLP', email: 'billing@johnsonpartners.com', address: '123 Legal St, New York, NY 10001' },
  { id: 2, name: 'Smith Collections Agency', email: 'accounts@smithcollections.com', address: '456 Finance Ave, Chicago, IL 60601' },
  { id: 3, name: 'Adams Credit Recovery', email: 'invoicing@adamsrecovery.com', address: '789 Main St, Los Angeles, CA 90001' },
];

// Mock data for case matters
const matters = [
  { id: 101, name: 'Big Bank Inc. Collections', client: 1, debtors: ['Jane Doe', 'John Smith'], totalDebt: 12500.00 },
  { id: 102, name: 'Medical Center Corp. Recovery', client: 2, debtors: ['Robert Johnson', 'Mary Williams'], totalDebt: 8750.50 },
  { id: 103, name: 'Utility Co. Default Accounts', client: 1, debtors: ['David Brown', 'Lisa Davis'], totalDebt: 3450.75 },
];

// Invoice templates
const invoiceTemplates = [
  { id: 1, name: 'Standard Legal Services', description: 'Basic legal services invoice template' },
  { id: 2, name: 'Collection Services', description: 'Specialized for debt collection services' },
  { id: 3, name: 'Litigation Package', description: 'For court-related fees and legal filings' },
];

// Styled invoice preview
const InvoicePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  maxHeight: '60vh',
  overflowY: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
}));

// Initial empty line item
const emptyLineItem = {
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
  taxable: false
};

function InvoiceCreation() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-' + Math.floor(10000 + Math.random() * 90000));
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(addDays(new Date(), 30));
  const [lineItems, setLineItems] = useState([{ ...emptyLineItem }]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('Payment is due within 30 days of invoice date. Late payments subject to 1.5% monthly interest.');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Steps for invoice creation process
  const steps = ['Select Client & Matter', 'Add Line Items', 'Review & Send'];

  // Calculate subtotal, tax, and total
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  // Handle adding a line item
  const handleAddLineItem = () => {
    setLineItems([...lineItems, { ...emptyLineItem }]);
  };

  // Handle removing a line item
  const handleRemoveLineItem = (index) => {
    const newLineItems = [...lineItems];
    newLineItems.splice(index, 1);
    setLineItems(newLineItems);
  };

  // Handle line item change
  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][field] = value;
    
    // Automatically calculate amount
    if (field === 'quantity' || field === 'rate') {
      newLineItems[index].amount = newLineItems[index].quantity * newLineItems[index].rate;
    }
    
    setLineItems(newLineItems);
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step
    if (!validateStep(activeStep)) {
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    if (step === 0) {
      if (!selectedClient) {
        errors.client = 'Please select a client';
        isValid = false;
      }
      if (!selectedMatter) {
        errors.matter = 'Please select a matter';
        isValid = false;
      }
      if (!invoiceNumber) {
        errors.invoiceNumber = 'Invoice number is required';
        isValid = false;
      }
    }
    
    if (step === 1) {
      if (lineItems.length === 0) {
        errors.lineItems = 'At least one line item is required';
        isValid = false;
      } else {
        const invalidItems = lineItems.filter(item => !item.description || item.rate <= 0);
        if (invalidItems.length > 0) {
          errors.lineItems = 'All line items must have a description and rate greater than zero';
          isValid = false;
        }
      }
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  // Handle preview toggle
  const togglePreview = () => {
    setPreviewOpen(!previewOpen);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Add sample line items based on template
    if (template.id === 1) { // Standard Legal Services
      setLineItems([
        { description: 'Legal Consultation', quantity: 2, rate: 150, amount: 300, taxable: true },
        { description: 'Document Review', quantity: 3, rate: 125, amount: 375, taxable: true },
      ]);
    } else if (template.id === 2) { // Collection Services
      setLineItems([
        { description: 'Debt Collection Fee', quantity: 1, rate: 250, amount: 250, taxable: true },
        { description: 'Skip Tracing Services', quantity: 1, rate: 75, amount: 75, taxable: true },
        { description: 'Document Processing Fee', quantity: 10, rate: 5, amount: 50, taxable: false },
      ]);
    } else if (template.id === 3) { // Litigation Package
      setLineItems([
        { description: 'Court Filing Fee', quantity: 1, rate: 150, amount: 150, taxable: false },
        { description: 'Legal Representation (hours)', quantity: 4, rate: 200, amount: 800, taxable: true },
        { description: 'Document Preparation', quantity: 1, rate: 350, amount: 350, taxable: true },
      ]);
    }
  };

  // Handle save invoice
  const handleSaveInvoice = () => {
    // Validation
    if (!validateStep(activeStep)) {
      return;
    }
    
    console.log('Saving invoice:', {
      invoiceNumber,
      client: selectedClient,
      matter: selectedMatter,
      date: invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      notes,
      termsAndConditions,
      attachments
    });
    
    // In a real app, this would save to backend
    // For now, show success message and redirect
    alert('Invoice saved successfully!');
    navigate('/invoices');
  };

  // Handle send invoice
  const handleSendInvoice = () => {
    // Validation
    if (!validateStep(activeStep)) {
      return;
    }
    
    console.log('Sending invoice:', {
      invoiceNumber,
      client: selectedClient,
      matter: selectedMatter,
      date: invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      notes,
      termsAndConditions,
      attachments
    });
    
    // In a real app, this would send to client
    // For now, show success message and redirect
    alert('Invoice sent successfully!');
    navigate('/invoices');
  };

  // Handle attachment selection
  const handleAttachDocument = (document) => {
    setAttachments([...attachments, document]);
  };

  // Handle attachment removal
  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Mock document browser dialog
  const [documentBrowserOpen, setDocumentBrowserOpen] = useState(false);
  const toggleDocumentBrowser = () => {
    setDocumentBrowserOpen(!documentBrowserOpen);
  };

  // Mock documents
  const availableDocuments = [
    { id: 'doc1', name: 'ACC_12345_Statement_Jan2025.pdf', type: 'Account Statement', date: '2025-01-15' },
    { id: 'doc2', name: 'ACC_12345_Notice_Dec2024.pdf', type: 'Collection Notice', date: '2024-12-10' },
    { id: 'doc3', name: 'ACC_67890_Agreement.pdf', type: 'Credit Agreement', date: '2023-05-01' },
  ];

  // Render different step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Client & Matter Information" 
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Autocomplete
                          options={clients}
                          getOptionLabel={(option) => option.name}
                          value={selectedClient}
                          onChange={(event, newValue) => {
                            setSelectedClient(newValue);
                            // Reset matter when client changes
                            setSelectedMatter(null);
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Client" 
                              required
                              error={!!validationErrors.client}
                              helperText={validationErrors.client}
                            />
                          )}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Autocomplete
                          options={matters.filter(m => !selectedClient || m.client === selectedClient.id)}
                          getOptionLabel={(option) => option.name}
                          value={selectedMatter}
                          onChange={(event, newValue) => {
                            setSelectedMatter(newValue);
                          }}
                          disabled={!selectedClient}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Matter" 
                              required
                              error={!!validationErrors.matter}
                              helperText={validationErrors.matter}
                            />
                          )}
                        />
                      </Grid>
                      
                      {selectedMatter && (
                        <Grid item xs={12}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom>
                                Matter Details
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Debtors
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                  {selectedMatter.debtors.map((debtor, index) => (
                                    <Chip 
                                      key={index}
                                      label={debtor}
                                      size="small"
                                      icon={<PeopleIcon />}
                                      variant="outlined"
                                    />
                                  ))}
                                </Stack>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Total Debt Amount
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                ${selectedMatter.totalDebt.toFixed(2)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Invoice Details" 
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Invoice Number"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          required
                          error={!!validationErrors.invoiceNumber}
                          helperText={validationErrors.invoiceNumber}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Invoice Date"
                            value={invoiceDate}
                            onChange={(newValue) => setInvoiceDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Autocomplete
                          options={invoiceTemplates}
                          getOptionLabel={(option) => option.name}
                          value={selectedTemplate}
                          onChange={(event, newValue) => {
                            handleTemplateSelect(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Invoice Template (Optional)" 
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box>
                                <Typography variant="body1">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            </li>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Paper variant="outlined" sx={{ mb: 3 }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Line Items</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddLineItem}
                  variant="contained"
                  size="small"
                >
                  Add Item
                </Button>
              </Box>
              
              <Divider />
              
              {validationErrors.lineItems && (
                <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
                  {validationErrors.lineItems}
                </Alert>
              )}
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Rate ($)</TableCell>
                      <TableCell align="right">Amount ($)</TableCell>
                      <TableCell align="center">Taxable</TableCell>
                      <TableCell width="50px"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="standard"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Enter item description"
                            required
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            variant="standard"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            variant="standard"
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                            sx={{ width: 80 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={item.taxable}
                            onChange={(e) => handleLineItemChange(index, 'taxable', e.target.checked)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveLineItem(index)}
                            disabled={lineItems.length === 1}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Additional Information" 
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          multiline
                          rows={3}
                          placeholder="Enter additional notes for the client"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Terms and Conditions"
                          value={termsAndConditions}
                          onChange={(e) => setTermsAndConditions(e.target.value)}
                          multiline
                          rows={3}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            onClick={toggleDocumentBrowser}
                          >
                            Attach Documents
                          </Button>
                          <Typography variant="body2" color="text.secondary">
                            {attachments.length} document(s) attached
                          </Typography>
                        </Box>
                        
                        {attachments.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Attachments
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <List dense disablePadding>
                                {attachments.map((doc, index) => (
                                  <ListItem
                                    key={index}
                                    secondaryAction={
                                      <IconButton edge="end" size="small" onClick={() => handleRemoveAttachment(index)}>
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    }
                                    sx={{ py: 0.5 }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <DescriptionIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={doc.name}
                                      secondary={doc.type}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                      secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Summary" 
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          type="number"
                          label="Tax Rate (%)"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Subtotal:</Typography>
                          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Tax ({taxRate}%):</Typography>
                          <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Invoice Preview" 
                    titleTypographyProps={{ variant: 'h6' }}
                    action={
                      <Button
                        startIcon={<PreviewIcon />}
                        onClick={togglePreview}
                        variant="outlined"
                      >
                        Full Preview
                      </Button>
                    }
                  />
                  <CardContent sx={{ p: 0 }}>
                    <InvoicePreview>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Box>
                          <Typography variant="h4" gutterBottom>INVOICE</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedClient && selectedClient.name}<br />
                            {selectedClient && selectedClient.address}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold' }}># {invoiceNumber}</Typography>
                          <Typography>
                            Date: {format(invoiceDate, 'MM/dd/yyyy')}<br />
                            Due: {format(dueDate, 'MM/dd/yyyy')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>Bill To:</Typography>
                        <Typography>{selectedClient && selectedClient.name}</Typography>
                        <Typography>{selectedClient && selectedClient.address}</Typography>
                        <Typography>Email: {selectedClient && selectedClient.email}</Typography>
                      </Box>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        RE: {selectedMatter && selectedMatter.name}
                      </Typography>
                      
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: 'grey.100' }}>
                              <TableCell>Description</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Rate</TableCell>
                              <TableCell align="right">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {lineItems.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">${item.rate.toFixed(2)}</TableCell>
                                <TableCell align="right">${(item.quantity * item.rate).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                        <Box sx={{ width: 250 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>Tax ({taxRate}%):</Typography>
                            <Typography>${taxAmount.toFixed(2)}</Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Total:</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {notes && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
                          <Typography variant="body2">{notes}</Typography>
                        </Box>
                      )}
                      
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Terms & Conditions:</Typography>
                        <Typography variant="body2">{termsAndConditions}</Typography>
                      </Box>
                      
                      {attachments.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="subtitle2" gutterBottom>Attachments:</Typography>
                          <List dense>
                            {attachments.map((doc, index) => (
                              <ListItem key={index} disablePadding>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <DescriptionIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={doc.name}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </InvoicePreview>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Stack spacing={2}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="Invoice Summary" 
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <List>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Client"
                            secondary={selectedClient ? selectedClient.name : 'Not selected'}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Matter"
                            secondary={selectedMatter ? selectedMatter.name : 'Not selected'}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Invoice Number"
                            secondary={invoiceNumber}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Date"
                            secondary={format(invoiceDate, 'MMMM d, yyyy')}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Due Date"
                            secondary={format(dueDate, 'MMMM d, yyyy')}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Line Items"
                            secondary={`${lineItems.length} items`}
                          />
                        </ListItem>
                        
                        <Divider component="li" />
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Total Amount"
                            secondary={`${total.toFixed(2)}`}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                  
                  <Alert severity="info" icon={<InfoIcon />}>
                    Review the invoice details carefully before sending. Once sent, the invoice will be emailed to the client and recorded in the system.
                  </Alert>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  // Document browser dialog
  const DocumentBrowserDialog = () => (
    <Dialog 
      open={documentBrowserOpen} 
      onClose={toggleDocumentBrowser}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Select Documents to Attach
        <IconButton
          aria-label="close"
          onClick={toggleDocumentBrowser}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => {
                        handleAttachDocument(doc);
                        toggleDocumentBrowser();
                      }}
                      disabled={attachments.some(a => a.id === doc.id)}
                    >
                      {attachments.some(a => a.id === doc.id) ? 'Already Attached' : 'Attach'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDocumentBrowser}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // Invoice preview dialog
  const InvoicePreviewDialog = () => (
    <Dialog 
      open={previewOpen} 
      onClose={togglePreview}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Invoice Preview
        <IconButton
          aria-label="close"
          onClick={togglePreview}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <InvoicePreview>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h4" gutterBottom>INVOICE</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedClient && selectedClient.name}<br />
                {selectedClient && selectedClient.address}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}># {invoiceNumber}</Typography>
              <Typography>
                Date: {format(invoiceDate, 'MM/dd/yyyy')}<br />
                Due: {format(dueDate, 'MM/dd/yyyy')}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Bill To:</Typography>
            <Typography>{selectedClient && selectedClient.name}</Typography>
            <Typography>{selectedClient && selectedClient.address}</Typography>
            <Typography>Email: {selectedClient && selectedClient.email}</Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            RE: {selectedMatter && selectedMatter.name}
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.rate.toFixed(2)}</TableCell>
                    <TableCell align="right">${(item.quantity * item.rate).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Box sx={{ width: 250 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax ({taxRate}%):</Typography>
                <Typography>${taxAmount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Box>
          
          {notes && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
              <Typography variant="body2">{notes}</Typography>
            </Box>
          )}
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Terms & Conditions:</Typography>
            <Typography variant="body2">{termsAndConditions}</Typography>
          </Box>
          
          {attachments.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>Attachments:</Typography>
              <List dense>
                {attachments.map((doc, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={doc.name}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </InvoicePreview>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<PrintIcon />} onClick={togglePreview}>Print</Button>
        <Button startIcon={<DownloadIcon />} onClick={togglePreview}>Download</Button>
        <Button onClick={togglePreview}>Close</Button>
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
        <Typography color="text.primary">Create Invoice</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Create New Invoice</Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            sx={{ mr: 1 }}
            component={RouterLink}
            to="/invoices"
          >
            Cancel
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <>
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />} 
                sx={{ mr: 1 }}
                onClick={handleSaveInvoice}
              >
                Save Draft
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SendIcon />}
                onClick={handleSendInvoice}
                color="primary"
              >
                Send Invoice
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
            >
              Continue
            </Button>
          )}
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
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSendInvoice : handleNext}
          endIcon={activeStep === steps.length - 1 ? <SendIcon /> : <ArrowForwardIosIcon />}
        >
          {activeStep === steps.length - 1 ? 'Send Invoice' : 'Continue'}
        </Button>
      </Box>
      
      {/* Document Browser Dialog */}
      <DocumentBrowserDialog />
      
      {/* Invoice Preview Dialog */}
      <InvoicePreviewDialog />
    </Box>
  );
}

export default InvoiceCreation;