import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import DebtCollectionDashboard from './components/dashboard/DebtCollectionDashboard';
import DocumentBrowser from './components/document/DocumentBrowser';
import DocumentDetail from './components/document/DocumentDetail';
import DocumentProcessor from './components/document/DocumentProcessor';
import InvoiceUploadPage from './components/invoicing/InvoiceUploadPage';
import InvoiceDashboard from './components/invoicing/InvoiceDashboard';
import CaseManagement from './components/case/CaseManagement';
import CaseDetail from './components/case/CaseDetail';

// Accessibility
import { SkipLink } from './utils/AccessibilityEnhancements';

// Create context for app-wide state
const AppContext = createContext();

// Custom hook to use app store
export const useAppStore = () => {
  return useContext(AppContext);
};

// App store provider
const AppStoreProvider = ({ children }) => {
  const [state, setState] = useState({
    // Define any app state here, for example:
    user: null,
    theme: 'light',
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

// Define the routes for the app
const AppRouter = () => (
  <AppStoreProvider>
    <Router>
      {/* Add skip link for keyboard accessibility */}
      <SkipLink />
      
      <Routes>
        {/* Main application routes */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Dashboard - Home Page */}
          <Route index element={<DebtCollectionDashboard />} />
          
          {/* Document Routes */}
          <Route path="documents">
            <Route index element={<DocumentBrowser />} />
            <Route path=":documentId" element={<DocumentDetail />} />
            <Route path=":documentId/process" element={<DocumentProcessor />} />
            <Route path="upload" element={<InvoiceUploadPage />} />
          </Route>
          
          {/* Invoice Routes */}
          <Route path="invoices">
            <Route index element={<InvoiceDashboard />} />
            <Route path="create" element={<InvoiceUploadPage />} />
          </Route>
          
          {/* Case Routes */}
          <Route path="cases">
            <Route index element={<CaseManagement />} />
            <Route path=":caseId" element={<CaseDetail />} />
            <Route path="create" element={<CaseDetail />} />
          </Route>
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  </AppStoreProvider>
);

export default AppRouter;
