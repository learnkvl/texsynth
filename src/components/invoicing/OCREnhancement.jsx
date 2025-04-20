// src/components/invoicing/OCREnhancement.jsx
import React, { useState, useEffect } from 'react';

/**
 * Post-processes OCR results to enhance accuracy for debt collection documents
 * @param {Object} rawOCRData - The raw OCR data
 * @returns {Object} Enhanced OCR data with corrected fields
 */
const enhanceOCRData = (rawOCRData) => {
  if (!rawOCRData) return null;
  
  const enhanced = { ...rawOCRData };
  
  // Apply field-specific corrections and enhancements
  if (enhanced.fields) {
    // 1. Format currency values
    ['totalAmount', 'principalAmount', 'interestAmount', 'feeAmount'].forEach(field => {
      if (enhanced.fields[field]) {
        // Clean currency values
        let value = enhanced.fields[field];
        
        // Remove non-numeric characters except decimal point
        if (typeof value === 'string') {
          value = value.replace(/[^0-9.]/g, '');
          // Convert to number
          value = parseFloat(value);
        }
        
        // Format as currency with 2 decimal places
        if (!isNaN(value)) {
          enhanced.fields[field] = value.toFixed(2);
        }
      }
    });
    
    // 2. Format account numbers (remove spaces, standardize format)
    if (enhanced.fields.accountNumber) {
      let accountNum = enhanced.fields.accountNumber;
      
      // Remove spaces and common prefixes
      accountNum = accountNum.replace(/\s+/g, '');
      
      // Check for common account number patterns and format
      if (/^\d{5,12}$/.test(accountNum)) {
        // Basic numeric account
        enhanced.fields.accountNumber = accountNum;
      } else if (/^[A-Za-z]{3}-\d+-\d+$/.test(accountNum)) {
        // Already in format like ACC-12345-678
        enhanced.fields.accountNumber = accountNum.toUpperCase();
      } else if (/^[A-Za-z]{3}\d+/.test(accountNum)) {
        // Format like ACC12345678
        const prefix = accountNum.substring(0, 3).toUpperCase();
        const numbers = accountNum.substring(3);
        if (numbers.length > 5) {
          enhanced.fields.accountNumber = `${prefix}-${numbers.slice(0, 5)}-${numbers.slice(5)}`;
        } else {
          enhanced.fields.accountNumber = `${prefix}-${numbers}`;
        }
      } else if (/^\d+$/.test(accountNum) && accountNum.length > 5) {
        // Just numbers, add ACC prefix
        enhanced.fields.accountNumber = `ACC-${accountNum.slice(0, 5)}-${accountNum.slice(5)}`;
      }
    }
    
    // 3. Clean up debtor name (fix common OCR issues with names)
    if (enhanced.fields.debtorName) {
      let name = enhanced.fields.debtorName;
      
      // Remove any reference numbers or extraneous info
      name = name.replace(/\b[A-Z0-9]{5,}\b/, '');
      
      // Fix common OCR errors in names
      name = name.replace(/l\/lr\./, 'Mr.');
      name = name.replace(/l\/lrs\./, 'Mrs.');
      name = name.replace(/l\/ls\./, 'Ms.');
      
      // Clean excess whitespace
      name = name.replace(/\s+/g, ' ').trim();
      
      enhanced.fields.debtorName = name;
    }
    
    // 4. Format dates consistently
    ['dueDate', 'issueDate', 'serviceDate'].forEach(field => {
      if (enhanced.fields[field]) {
        const dateStr = enhanced.fields[field];
        
        try {
          // Parse various date formats
          let parsedDate;
          
          // Check if it's already a date object
          if (dateStr instanceof Date) {
            parsedDate = dateStr;
          } 
          // Check if it's a string in ISO format (YYYY-MM-DD)
          else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
            parsedDate = new Date(year, month - 1, day);
          }
          // Check MM/DD/YYYY format
          else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
            const [month, day, year] = dateStr.split('/').map(num => parseInt(num, 10));
            parsedDate = new Date(year, month - 1, day);
          }
          // Check textual date (like "January 5, 2025")
          else if (/[A-Za-z]+\s+\d{1,2},\s+\d{4}/.test(dateStr)) {
            parsedDate = new Date(dateStr);
          }
          
          // Format as YYYY-MM-DD
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            enhanced.fields[field] = `${year}-${month}-${day}`;
          }
        } catch (e) {
          // Keep original if parsing fails
          console.error(`Error parsing date for ${field}:`, e);
        }
      }
    });
    
    // 5. Calculate and verify totals
    if (enhanced.fields.principalAmount && enhanced.fields.interestAmount) {
      const principal = parseFloat(enhanced.fields.principalAmount.replace(/[^0-9.]/g, ''));
      const interest = parseFloat(enhanced.fields.interestAmount.replace(/[^0-9.]/g, ''));
      
      if (!isNaN(principal) && !isNaN(interest)) {
        const fees = enhanced.fields.feeAmount 
          ? parseFloat(enhanced.fields.feeAmount.replace(/[^0-9.]/g, '')) 
          : 0;
        
        const calculatedTotal = principal + interest + (isNaN(fees) ? 0 : fees);
        
        // If we have a total amount, check if it matches our calculation
        if (enhanced.fields.totalAmount) {
          const recordedTotal = parseFloat(enhanced.fields.totalAmount.replace(/[^0-9.]/g, ''));
          
          // If there's a significant discrepancy, flag it
          if (!isNaN(recordedTotal) && Math.abs(calculatedTotal - recordedTotal) > 0.1) {
            enhanced.warnings = enhanced.warnings || [];
            enhanced.warnings.push({
              type: 'totalMismatch',
              message: 'Calculated total does not match stated total',
              details: {
                calculated: calculatedTotal.toFixed(2),
                stated: recordedTotal.toFixed(2),
                difference: Math.abs(calculatedTotal - recordedTotal).toFixed(2)
              }
            });
          }
        } else {
          // If no total was detected, add the calculated one
          enhanced.fields.totalAmount = calculatedTotal.toFixed(2);
          enhanced.fields.totalAmountCalculated = true;
        }
      }
    }
  }
  
  // Add confidence scores to each field
  if (enhanced.fields) {
    enhanced.fieldConfidence = {};
    
    Object.keys(enhanced.fields).forEach(field => {
      // Base confidence calculation logic
      let confidence = 0.7; // Default base confidence
      
      // Adjust confidence based on field type and validation rules
      switch (field) {
        case 'accountNumber':
          // Higher confidence if it matches expected patterns
          if (/^[A-Za-z]{3}-\d{5}-\d{3}$/.test(enhanced.fields[field])) {
            confidence = 0.95;
          } else if (/^[A-Za-z]{2,5}-\d{4,8}$/.test(enhanced.fields[field])) {
            confidence = 0.85;
          }
          break;
          
        case 'totalAmount':
        case 'principalAmount':
        case 'interestAmount':
          // Higher confidence for well-formatted currency values
          if (/^\d+\.\d{2}$/.test(enhanced.fields[field])) {
            confidence = 0.9;
          }
          // Lower confidence if it was calculated rather than extracted
          if (field === 'totalAmount' && enhanced.fields.totalAmountCalculated) {
            confidence = 0.8;
          }
          break;
          
        case 'dueDate':
        case 'issueDate':
        case 'serviceDate':
          // Higher confidence for well-formatted dates
          if (/^\d{4}-\d{2}-\d{2}$/.test(enhanced.fields[field])) {
            confidence = 0.9;
          }
          break;
          
        case 'debtorName':
          // Higher confidence if name looks realistic (not too short, no numbers)
          if (enhanced.fields[field].length > 3 && !/\d/.test(enhanced.fields[field])) {
            confidence = 0.85;
          }
          break;
          
        default:
          confidence = 0.75;
      }
      
      enhanced.fieldConfidence[field] = confidence;
    });
  }
  
  return enhanced;
};

/**
 * Quality checks for debt collection specific requirements
 * @param {Object} enhancedData - The enhanced OCR data
 * @returns {Array} Quality check results
 */
const performQualityChecks = (enhancedData) => {
  const checks = [];
  
  if (!enhancedData || !enhancedData.fields) {
    return [{ passed: false, message: 'No data available for quality checks', severity: 'error' }];
  }
  
  const { fields } = enhancedData;
  
  // Check for required fields for debt collection invoices
  const requiredFields = ['debtorName', 'accountNumber', 'totalAmount'];
  const missingFields = requiredFields.filter(field => !fields[field]);
  
  if (missingFields.length > 0) {
    checks.push({
      passed: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
      severity: 'error',
      fields: missingFields
    });
  }
  
  // Check account number format
  if (fields.accountNumber) {
    const validFormat = /^[A-Za-z]{2,5}-\d{4,8}(-\d{1,5})?$/.test(fields.accountNumber);
    checks.push({
      passed: validFormat,
      message: validFormat ? 'Account number format is valid' : 'Account number format may be incorrect',
      severity: validFormat ? 'success' : 'warning',
      fields: ['accountNumber']
    });
  }
  
  // Check for negative amounts
  ['totalAmount', 'principalAmount', 'interestAmount', 'feeAmount'].forEach(field => {
    if (fields[field]) {
      const amount = parseFloat(fields[field].replace(/[^0-9.-]/g, ''));
      if (!isNaN(amount) && amount < 0) {
        checks.push({
          passed: false,
          message: `${field.replace(/([A-Z])/g, ' $1').trim()} should not be negative`,
          severity: 'error',
          fields: [field]
        });
      }
    }
  });
  
  // Check date consistency
  if (fields.issueDate && fields.dueDate) {
    const issueDate = new Date(fields.issueDate);
    const dueDate = new Date(fields.dueDate);
    
    if (!isNaN(issueDate.getTime()) && !isNaN(dueDate.getTime())) {
      if (dueDate < issueDate) {
        checks.push({
          passed: false,
          message: 'Due date is before issue date',
          severity: 'error',
          fields: ['issueDate', 'dueDate']
        });
      }
    }
  }
  
  // Check for reasonable total amount (debt collection specific)
  if (fields.totalAmount) {
    const amount = parseFloat(fields.totalAmount.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      if (amount > 1000000) {
        checks.push({
          passed: false,
          message: 'Total amount seems unreasonably high',
          severity: 'warning',
          fields: ['totalAmount']
        });
      } else if (amount < 10) {
        checks.push({
          passed: false,
          message: 'Total amount seems unreasonably low for debt collection',
          severity: 'warning',
          fields: ['totalAmount']
        });
      }
    }
  }
  
  // Add any warnings from the enhancement process
  if (enhancedData.warnings) {
    enhancedData.warnings.forEach(warning => {
      checks.push({
        passed: false,
        message: warning.message,
        severity: 'warning',
        details: warning.details,
        fields: [warning.type.replace('Mismatch', '')]
      });
    });
  }
  
  // Add passed check if everything looks good
  if (checks.length === 0) {
    checks.push({
      passed: true,
      message: 'All quality checks passed',
      severity: 'success'
    });
  }
  
  return checks;
};

/**
 * OCR Enhancement Component for Debt Collection Documents
 */
const OCREnhancement = ({ ocrData, templateType, onEnhancement }) => {
  const [enhancedData, setEnhancedData] = useState(null);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (ocrData) {
      processOCRData();
    }
  }, [ocrData, templateType]);
  
  const processOCRData = async () => {
    setProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Enhance OCR data
    const enhanced = enhanceOCRData(ocrData);
    setEnhancedData(enhanced);
    
    // Perform quality checks
    const checks = performQualityChecks(enhanced);
    setQualityChecks(checks);
    
    // Call callback with enhanced data and quality checks
    if (onEnhancement) {
      onEnhancement(enhanced, checks);
    }
    
    setProcessing(false);
  };
  
  // Render confidence indicator
  const renderConfidenceIndicator = (score) => {
    const getColor = () => {
      if (score >= 0.9) return '#4caf50'; // success
      if (score >= 0.75) return '#ff9800'; // warning
      return '#f44336'; // error
    };
    
    return (
      <div className="flex items-center">
        <div
          className="w-10 h-2 rounded-full mr-1"
          style={{ backgroundColor: getColor() }}
        />
        <span className="text-xs text-gray-500">
          {Math.round(score * 100)}%
        </span>
      </div>
    );
  };
  
  if (!ocrData) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded p-3 mb-4">
        <p className="text-sm">
          Process a document to see the enhanced OCR results
        </p>
      </div>
    );
  }
  
  if (processing) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">
          Enhancing OCR data for debt collection documents...
        </p>
      </div>
    );
  }
  
  if (!enhancedData) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="bg-green-50 border border-green-200 text-green-800 rounded p-3 mb-4">
        <p className="text-sm font-medium">
          OCR data enhanced with debt collection specific processing
        </p>
      </div>
      
      {qualityChecks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Quality Checks</h4>
          <div className="space-y-2">
            {qualityChecks.map((check, index) => (
              <div 
                key={index}
                className={`flex items-start p-2 rounded ${
                  check.severity === 'success' ? 'bg-green-50 text-green-800' : 
                  check.severity === 'warning' ? 'bg-yellow-50 text-yellow-800' : 
                  'bg-red-50 text-red-800'
                }`}
              >
                {check.severity === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <div>
                  <p className="text-sm">{check.message}</p>
                  {check.details && (
                    <div className="text-xs mt-1">
                      {Object.entries(check.details).map(([key, value], i) => (
                        <div key={i} className="flex items-center">
                          <span className="font-medium mr-1">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {enhancedData.fields && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Enhanced Fields</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(enhancedData.fields).map(([field, value], index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <span className="text-xs text-gray-500 block mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{value}</span>
                  {enhancedData.fieldConfidence && enhancedData.fieldConfidence[field] && 
                    renderConfidenceIndicator(enhancedData.fieldConfidence[field])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-right">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded"
          onClick={processOCRData}
        >
          Reprocess Data
        </button>
      </div>
    </div>
  );
};

export default OCREnhancement;