// src/routes/index.js
import { Route } from 'react-router-dom';
import SearchPage from '../components/SearchPage';
import DocumentDetail from '../components/DocumentDetail';
import CaseManagement from '../components/CaseManagement';
import UploadDocuments from '../components/UploadDocuments';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings';
import InvoiceDashboard from '../components/invoicing/InvoiceDashboard';
import InvoiceCreation from '../components/invoicing/InvoiceCreation';

// Define routes for easier management
export const appRoutes = [
  <Route path="/" element={<SearchPage />} />,
  <Route path="/document/:id" element={<DocumentDetail />} />,
  <Route path="/cases" element={<CaseManagement />} />,
  <Route path="/upload" element={<UploadDocuments />} />,
  <Route path="/dashboard" element={<Dashboard />} />,
  <Route path="/settings" element={<Settings />} />,
  <Route path="/invoices/create" element={<InvoiceCreation />} />,
  <Route path="/invoices" element={<InvoiceDashboard />} />,
];
