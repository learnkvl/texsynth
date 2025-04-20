// src/utils/AccessibilityEnhancements.js
import React from 'react';
import { visuallyHidden } from '@mui/utils';
import { Box } from '@mui/material';

/**
 * This utility file contains components and functions to enhance accessibility
 * throughout the debt collection eDiscovery application
 */

/**
 * SkipLink component - allows keyboard users to skip navigation 
 * and go directly to main content
 */
export const SkipLink = () => {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        ...visuallyHidden,
        position: 'absolute',
        top: 8,
        left: 8,
        p: 2,
        bgcolor: 'background.paper',
        zIndex: 9999,
        border: '1px solid',
        borderColor: 'primary.main',
        fontWeight: 'bold',
        '&:focus': {
          clip: 'auto',
          width: 'auto',
          height: 'auto',
          overflow: 'visible',
        },
      }}
    >
      Skip to main content
    </Box>
  );
};

/**
 * VisuallyHidden component - visually hides content but keeps it accessible
 * to screen readers
 */
export const VisuallyHidden = ({ children }) => {
  return <Box sx={visuallyHidden}>{children}</Box>;
};

/**
 * LiveAnnouncer component - announces dynamic content changes to screen readers
 */
export const LiveAnnouncer = ({ message, assertive = false }) => {
  return (
    <Box
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      sx={visuallyHidden}
    >
      {message}
    </Box>
  );
};

/**
 * ARIA attribute helpers to ensure consistent accessibility patterns
 */
export const ariaAttributes = {
  // Provide ARIA attributes for table sorting
  getTableSortProps: (field, sortField, sortDirection) => ({
    'aria-sort': sortField === field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none',
    'aria-label': `Sort by ${field}${sortField === field ? (sortDirection === 'asc' ? ', sorted ascending' : ', sorted descending') : ''}`,
  }),
  
  // Provide ARIA attributes for tabs
  getTabProps: (index, selected) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
    'aria-selected': selected,
  }),
  
  // Provide ARIA attributes for tab panels
  getTabPanelProps: (index) => ({
    id: `tabpanel-${index}`,
    'aria-labelledby': `tab-${index}`,
    role: 'tabpanel',
    tabIndex: 0,
  }),
  
  // Provide ARIA attributes for accordions
  getAccordionProps: (id, expanded) => ({
    'aria-expanded': expanded,
    'aria-controls': `panel-${id}-content`,
    id: `panel-${id}-header`,
  }),
  
  // Provide ARIA attributes for accordion content
  getAccordionContentProps: (id) => ({
    id: `panel-${id}-content`,
    'aria-labelledby': `panel-${id}-header`,
  }),
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  handleTabNavigation: (event, count, setIndex) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      setIndex(prev => (prev < count - 1 ? prev + 1 : 0));
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      setIndex(prev => (prev > 0 ? prev - 1 : count - 1));
      event.preventDefault();
    } else if (event.key === 'Home') {
      setIndex(0);
      event.preventDefault();
    } else if (event.key === 'End') {
      setIndex(count - 1);
      event.preventDefault();
    }
  },
};

/**
 * Ensure forms are accessible
 */
export const FormFieldLabel = ({ id, label, required }) => (
  <label htmlFor={id}>
    {label} {required && <span aria-label="required field">*</span>}
  </label>
);

/**
 * Improve screen reader information for various statuses
 */
export const getStatusA11yProps = (status, confidence) => {
  const statusMappings = {
    'processed': `Processed successfully with ${confidence}% confidence`,
    'processing': 'Currently being processed',
    'pending': 'Pending processing',
    'error': 'Processing failed, requires attention',
  };
  
  return {
    'aria-label': statusMappings[status] || status,
  };
};

/**
 * Add screen reader context for icon buttons
 */
export const a11yIconButton = (icon, label) => (
  <>
    {icon}
    <VisuallyHidden>{label}</VisuallyHidden>
  </>
);

/**
 * Focus management helpers for dialogs and modals
 */
export const focusManagement = {
  // Save and restore focus when opening/closing dialogs
  trapFocus: (dialogRef) => {
    const focusableElements = 
      dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    return {
      handleTabKey: (e) => {
        if (e.key === 'Tab') {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
  }
};

export default {
  SkipLink,
  VisuallyHidden,
  LiveAnnouncer,
  ariaAttributes,
  keyboardNavigation,
  FormFieldLabel,
  getStatusA11yProps,
  a11yIconButton,
  focusManagement
};