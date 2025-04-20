// src/components/invoicing/TemplateDetection.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Template signatures for debt collection agencies
const TEMPLATE_SIGNATURES = {
  'Standard Legal': {
    keywords: ['legal services', 'attorney', 'consultation', 'representation', 'court filing'],
    patterns: ['hours @ rate', 'retainer', 'legal fee', 'contingency'],
    structure: 'formal'
  },
  'Collection Services': {
    keywords: ['debt collection', 'collection fee', 'recovery', 'outstanding balance', 'interest'],
    patterns: ['principal', 'interest', 'fees', 'payment plan', 'settlement'],
    structure: 'tabular'
  },
  'Medical Debt': {
    keywords: ['patient', 'medical', 'healthcare', 'treatment', 'procedure', 'insurance'],
    patterns: ['service date', 'procedure code', 'billing code', 'insurance denied'],
    structure: 'itemized'
  },
  'Auto Loan': {
    keywords: ['vehicle', 'loan', 'auto', 'repossession', 'financing'],
    patterns: ['VIN', 'make', 'model', 'loan number', 'installment'],
    structure: 'summary'
  },
  'Mortgage': {
    keywords: ['mortgage', 'property', 'foreclosure', 'real estate', 'loan'],
    patterns: ['property address', 'loan number', 'principal balance', 'escrow'],
    structure: 'detailed'
  }
};

/**
 * Analyzes OCR text to determine the most appropriate template
 * @param {Object} ocrData - The extracted OCR data
 * @returns {Object} Template match with confidence scores
 */
const analyzeOCRContent = (ocrData) => {
  if (!ocrData || !ocrData.fullText) {
    return { bestMatch: null, confidence: 0, matches: [] };
  }
  
  const text = ocrData.fullText.toLowerCase();
  const matches = [];
  
  // Calculate match scores for each template
  Object.entries(TEMPLATE_SIGNATURES).forEach(([templateName, signature]) => {
    let score = 0;
    let totalPossibleScore = 0;
    
    // Check for keywords
    signature.keywords.forEach(keyword => {
      totalPossibleScore += 3;
      if (text.includes(keyword.toLowerCase())) {
        score += 3;
      }
    });
    
    // Check for patterns
    signature.patterns.forEach(pattern => {
      totalPossibleScore += 5;
      const regex = new RegExp(pattern.toLowerCase().replace(/\s+/g, '\\s+'), 'i');
      if (regex.test(text)) {
        score += 5;
      }
    });
    
    // Calculate percent match
    const percentMatch = (score / totalPossibleScore) * 100;
    
    matches.push({
      templateName,
      score,
      totalPossibleScore,
      percentMatch: Math.round(percentMatch),
      structureType: signature.structure
    });
  });
  
  // Sort by percent match
  matches.sort((a, b) => b.percentMatch - a.percentMatch);
  
  return {
    bestMatch: matches.length > 0 ? matches[0].templateName : null,
    confidence: matches.length > 0 ? matches[0].percentMatch : 0,
    matches
  };
};

/**
 * Detects field positions based on common debt document layouts
 * @param {Object} ocrData - The OCR data with text and bounding boxes
 * @param {String} templateType - The detected template type
 * @returns {Object} Detected fields with positions and confidence
 */
const detectFieldPositions = (ocrData, templateType) => {
  if (!ocrData || !ocrData.textBlocks || !templateType) {
    return {};
  }
  
  // Field detection patterns for debt collection documents
  const fieldPatterns = {
    debtorName: [
      /borrower\s*:\s*(.*)/i,
      /debtor\s*:\s*(.*)/i,
      /customer\s*:\s*(.*)/i,
      /client\s*:\s*(.*)/i,
      /name\s*:\s*(.*)/i,
      /patient\s*:\s*(.*)/i
    ],
    accountNumber: [
      /account\s*#?\s*:\s*(.*)/i,
      /account\s*number\s*:\s*(.*)/i,
      /acct\s*#?\s*:\s*(.*)/i,
      /loan\s*#?\s*:\s*(.*)/i,
      /reference\s*#?\s*:\s*(.*)/i
    ],
    originalAmount: [
      /original\s*amount\s*:\s*\$?([\d,.]+)/i,
      /principal\s*:\s*\$?([\d,.]+)/i,
      /balance\s*:\s*\$?([\d,.]+)/i,
      /original\s*balance\s*:\s*\$?([\d,.]+)/i,
      /loan\s*amount\s*:\s*\$?([\d,.]+)/i
    ],
    currentAmount: [
      /current\s*amount\s*:\s*\$?([\d,.]+)/i,
      /current\s*balance\s*:\s*\$?([\d,.]+)/i,
      /amount\s*due\s*:\s*\$?([\d,.]+)/i,
      /total\s*due\s*:\s*\$?([\d,.]+)/i,
      /outstanding\s*balance\s*:\s*\$?([\d,.]+)/i
    ],
    dueDate: [
      /due\s*date\s*:\s*(.*)/i,
      /payment\s*due\s*:\s*(.*)/i,
      /due\s*by\s*:\s*(.*)/i,
      /payable\s*by\s*:\s*(.*)/i
    ],
    interestRate: [
      /interest\s*rate\s*:\s*([\d.]+)%?/i,
      /rate\s*:\s*([\d.]+)%?/i,
      /apr\s*:\s*([\d.]+)%?/i
    ]
  };
  
  const detectedFields = {};
  
  // Custom field detection based on template type
  if (templateType === 'Medical Debt') {
    fieldPatterns.serviceDate = [
      /service\s*date\s*:\s*(.*)/i,
      /date\s*of\s*service\s*:\s*(.*)/i,
      /treatment\s*date\s*:\s*(.*)/i
    ];
    fieldPatterns.procedureCodes = [
      /procedure\s*code\s*:\s*(.*)/i,
      /billing\s*code\s*:\s*(.*)/i,
      /cpt\s*code\s*:\s*(.*)/i
    ];
  } else if (templateType === 'Auto Loan') {
    fieldPatterns.vehicleInfo = [
      /vehicle\s*:\s*(.*)/i,
      /make\s*\/\s*model\s*:\s*(.*)/i,
      /vin\s*:\s*(.*)/i
    ];
  } else if (templateType === 'Mortgage') {
    fieldPatterns.propertyAddress = [
      /property\s*address\s*:\s*(.*)/i,
      /property\s*location\s*:\s*(.*)/i,
      /subject\s*property\s*:\s*(.*)/i
    ];
    fieldPatterns.escrowAmount = [
      /escrow\s*:\s*\$?([\d,.]+)/i,
      /escrow\s*balance\s*:\s*\$?([\d,.]+)/i
    ];
  }
  
  // Process each text block to find matching fields
  ocrData.textBlocks.forEach(block => {
    const text = block.text;
    
    // Check each field type
    Object.entries(fieldPatterns).forEach(([fieldName, patterns]) => {
      // Skip if already found with high confidence
      if (detectedFields[fieldName] && detectedFields[fieldName].confidence > 0.8) {
        return;
      }
      
      // Try each pattern
      patterns.some(pattern => {
        const match = text.match(pattern);
        if (match && match[1]) {
          const value = match[1].trim();
          
          // Calculate confidence based on pattern match and position
          let confidence = 0.7; // Base confidence
          
          // Adjust confidence based on expected position for the template
          if (templateType === 'Collection Services' && 
              ['debtorName', 'accountNumber'].includes(fieldName) && 
              block.boundingBox.y < 0.3) {
            confidence += 0.2;
          }
          
          // Store the detected field if it's better than any previous match
          if (!detectedFields[fieldName] || detectedFields[fieldName].confidence < confidence) {
            detectedFields[fieldName] = {
              value,
              confidence,
              boundingBox: block.boundingBox
            };
          }
          
          return true; // Stop checking other patterns for this field
        }
        return false;
      });
    });
  });
  
  return detectedFields;
};

/**
 * Enhanced Template Detection Component
 */
const TemplateDetection = ({ ocrData, onTemplateDetected, onFieldsDetected }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [templateResults, setTemplateResults] = useState(null);
  const [detectedFields, setDetectedFields] = useState(null);
  
  useEffect(() => {
    if (ocrData) {
      analyzeDocument();
    }
  }, [ocrData]);
  
  const analyzeDocument = async () => {
    setAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Analyze template
    const results = analyzeOCRContent(ocrData);
    setTemplateResults(results);
    
    if (results.bestMatch) {
      // Detect fields based on template
      const fields = detectFieldPositions(ocrData, results.bestMatch);
      setDetectedFields(fields);
      
      // Call callback functions with results
      if (onTemplateDetected) {
        onTemplateDetected(results);
      }
      
      if (onFieldsDetected) {
        onFieldsDetected(fields);
      }
    }
    
    setAnalyzing(false);
  };
  
  if (!ocrData) {
    return (
      <Alert severity="info">
        Upload and process a document to detect its template.
      </Alert>
    );
  }
  
  if (analyzing) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Analyzing document structure...
        </Typography>
      </Box>
    );
  }
  
  if (!templateResults) {
    return null;
  }
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Template Analysis Results</Typography>
          
          {templateResults.bestMatch && (
            <Chip 
              icon={<AutoAwesomeIcon />} 
              label="AI Detected" 
              color="primary" 
              size="small" 
            />
          )}
        </Box>
        
        {templateResults.bestMatch ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Detected Template: <strong>{templateResults.bestMatch}</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Confidence: {templateResults.confidence}%
                </Typography>
                {templateResults.confidence > 80 && (
                  <CheckCircleIcon color="success" fontSize="small" />
                )}
              </Box>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Template Matches
            </Typography>
            <Paper variant="outlined" sx={{ p: 1, mb: 3 }}>
              {templateResults.matches.map((match, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderBottom: index < templateResults.matches.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <Typography variant="body2">
                    {match.templateName}
                  </Typography>
                  <Chip 
                    label={`${match.percentMatch}%`} 
                    size="small"
                    color={match.percentMatch > 70 ? 'success' : 'default'}
                    variant={index === 0 ? 'filled' : 'outlined'}
                  />
                </Box>
              ))}
            </Paper>
            
            {detectedFields && Object.keys(detectedFields).length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Detected Fields
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(detectedFields).map(([fieldName, data], index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 1,
                          backgroundColor: data.confidence > 0.8 ? 'rgba(76, 175, 80, 0.08)' : 'inherit'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {data.value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        ) : (
          <Alert severity="warning">
            Could not determine document template. Please select a template manually.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateDetection;