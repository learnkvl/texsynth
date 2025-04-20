// src/components/invoicing/InvoiceCreationWizard.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for clients
const clients = ['Johnson & Partners LLP', 'Smith Collections Agency', 'Adams Credit Recovery'];

const steps = ['Client & Basic Info', 'Line Items', 'Review & Submit'];

function InvoiceCreationWizard() {
  const [activeStep, setActiveStep] = useState(0);

  // Basic invoice fields
  const [clientName, setClientName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-' + Math.floor(1000 + Math.random() * 9000));
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(null);

  // Line items
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, rate: 0 }
  ]);

  // Navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Helpers
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  // Save / Submit
  const handleSubmit = () => {
    // Perform final validation, then submit to backend
    alert('Invoice Submitted!');
    // e.g. navigate to /invoices or show success message
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [...prev, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    setLineItems((prev) => {
      const newItems = [...prev];
      newItems[index][field] = value;
      return newItems;
    });
  };

  // Step content
  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Client & Basic Info</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Simple select for client (or use Autocomplete) */}
                <TextField
                  select
                  label="Client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="" disabled>Select Client</option>
                  {clients.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice Number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Invoice Date"
                    value={invoiceDate}
                    onChange={(date) => setInvoiceDate(date)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={(date) => setDueDate(date)}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Line Items</Typography>
            {lineItems.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    label="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value, 10) || 0)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Rate"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={1} display="flex" alignItems="center">
                  <IconButton color="error" onClick={() => handleRemoveLineItem(index)} disabled={lineItems.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddLineItem}
            >
              Add Item
            </Button>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Subtotal: ${subtotal.toFixed(2)}</Typography>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review & Submit</Typography>
            <Typography variant="body1">
              <strong>Client:</strong> {clientName}<br />
              <strong>Invoice #:</strong> {invoiceNumber}<br />
              <strong>Date:</strong> {invoiceDate?.toLocaleDateString()}<br />
              <strong>Due:</strong> {dueDate?.toLocaleDateString()}<br />
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Line Items:</Typography>
              {lineItems.map((li, i) => (
                <Typography key={i} sx={{ ml: 2 }}>
                  • {li.description} (Qty: {li.quantity}, Rate: ${li.rate})
                </Typography>
              ))}
              <Typography sx={{ mt: 1 }}><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</Typography>
            </Box>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Invoice</Typography>

      {/* Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <StepContent />
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
          >
            Submit Invoice
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default InvoiceCreationWizard;
