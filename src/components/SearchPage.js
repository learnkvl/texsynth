// src/components/SearchPage.js
import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import SearchBar from './SearchBar';
import DocumentList from './DocumentList';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Placeholder for API call
  const handleSearch = useCallback((searchParams) => {
    console.log('Searching with params:', searchParams);
    setIsLoading(true);
    setHasSearched(true);
    
    // Mock API call with timeout
    setTimeout(() => {
      setSearchResults([
        { 
          id: 'doc1', 
          name: 'ACC_12345_Statement_Jan2025.pdf', 
          type: 'Account Statement', 
          date: '2025-01-15', 
          score: 0.95, 
          creditor: 'Big Bank Inc.', 
          amount: 123.45 
        },
        { 
          id: 'doc2', 
          name: 'ACC_12345_Notice_Dec2024.pdf', 
          type: 'Collection Notice', 
          date: '2024-12-10', 
          score: 0.88, 
          creditor: 'Big Bank Inc.', 
          amount: 123.45 
        },
        { 
          id: 'doc3', 
          name: 'ACC_67890_Agreement.pdf', 
          type: 'Credit Agreement', 
          date: '2023-05-01', 
          score: 0.99, 
          creditor: 'Utility Co.', 
          amount: 500.00 
        },
        { 
          id: 'doc4', 
          name: 'ACC_67890_Default_Notice.pdf', 
          type: 'Default Notice', 
          date: '2024-09-15', 
          score: 0.97, 
          creditor: 'Utility Co.', 
          amount: 545.75 
        },
        { 
          id: 'doc5', 
          name: 'ACC_54321_Legal_Filing.pdf', 
          type: 'Legal Filing', 
          date: '2024-11-20', 
          score: 0.92, 
          creditor: 'Financial Services LLC', 
          amount: 2750.33 
        },
        { 
          id: 'doc6', 
          name: 'ACC_98765_Payment_Receipt.pdf', 
          type: 'Payment Receipt', 
          date: '2024-12-30', 
          score: 0.90, 
          creditor: 'Medical Center Corp.', 
          amount: 125.00 
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Document Search</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </Paper>
      
      {hasSearched ? (
        <DocumentList documents={searchResults} isLoading={isLoading} />
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>
          Use the search bar above to find documents. You can search by keywords, document types, account numbers, or date ranges.
        </Alert>
      )}
    </Box>
  );
}

export default SearchPage;
