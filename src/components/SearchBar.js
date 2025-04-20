// src/components/SearchBar.js
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Collapse,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { LoadingButton } from '@mui/lab';

const documentTypes = [
  'Account Statement',
  'Collection Notice',
  'Credit Agreement',
  'Payment Receipt',
  'Default Notice',
  'Dispute Letter',
  'Legal Filing',
  'Settlement Offer',
  'Assignment Document',
];

const creditors = [
  'Big Bank Inc.',
  'National Credit Union',
  'Medical Center Corp.',
  'Utility Co.',
  'Financial Services LLC',
  'Credit Card Company',
  'Auto Loan Provider',
];

function SearchBar({ onSearch, isLoading }) {
  const [keyword, setKeyword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [documentType, setDocumentType] = useState([]);
  const [creditor, setCreditor] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Handle search form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Collect all search parameters
    const searchParams = {
      keyword,
      accountNumber: accountNumber || null,
      documentType: documentType.length > 0 ? documentType : null,
      creditor: creditor || null,
      dateRange: (dateFrom || dateTo) ? {
        from: dateFrom,
        to: dateTo,
      } : null,
      amountRange: (amountMin || amountMax) ? {
        min: amountMin ? parseFloat(amountMin) : null,
        max: amountMax ? parseFloat(amountMax) : null,
      } : null,
    };
    
    onSearch(searchParams);
  };

  // Handle clearing the search form
  const handleClear = () => {
    setKeyword('');
    setAccountNumber('');
    setDocumentType([]);
    setCreditor('');
    setDateFrom(null);
    setDateTo(null);
    setAmountMin('');
    setAmountMax('');
  };

  // Toggle advanced search options
  const toggleAdvanced = () => {
    setExpanded(!expanded);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Basic search */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by keywords, account numbers, or debtor names..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: keyword && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setKeyword('')}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              id="document-type"
              multiple
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              input={<OutlinedInput label="Document Type" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value}
                      size="small"
                      sx={{ height: 24 }}
                    />
                  ))}
                </Box>
              )}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
          <LoadingButton
            variant="contained"
            color="primary" 
            type="submit"
            loading={isLoading}
            startIcon={<SearchIcon />}
            sx={{ flex: 1 }}
          >
            Search
          </LoadingButton>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleAdvanced}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Less' : 'More'}
          </Button>
        </Grid>
      </Grid>

      {/* Advanced search options */}
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Advanced Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField 
                fullWidth
                label="Account Number" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="creditor-label">Creditor</InputLabel>
                <Select
                  labelId="creditor-label"
                  id="creditor"
                  value={creditor}
                  onChange={(e) => setCreditor(e.target.value)}
                  label="Creditor"
                >
                  <MenuItem value=""><em>Any</em></MenuItem>
                  {creditors.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={dateTo}
                  onChange={(date) => setDateTo(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Min Amount"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Max Amount"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}

export default SearchBar;