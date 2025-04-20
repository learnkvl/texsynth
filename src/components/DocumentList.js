// src/components/DocumentList.js
import React, { useState } from 'react';
import { 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  TablePagination,
  Card,
  CardHeader,
  useTheme,
  Divider,
  Link,
  Stack,
  Badge,
  Alert,
  Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { formatDistanceToNow } from 'date-fns';
function getDocumentTypeChip(type) {
    let color = 'default';
    let icon = <DescriptionIcon fontSize="small" />;
    
    switch (type) {
      case 'Account Statement':
        color = 'info';
        icon = <DescriptionIcon fontSize="small" />;
        break;
      case 'Collection Notice':
        color = 'warning';
        icon = <AssignmentLateIcon fontSize="small" />;
        break;
      case 'Credit Agreement':
        color = 'primary';
        icon = <AccountBalanceIcon fontSize="small" />;
        break;
      case 'Payment Receipt':
        color = 'success';
        icon = <AttachMoneyIcon fontSize="small" />;
        break;
      case 'Default Notice':
        color = 'error';
        icon = <AssignmentLateIcon fontSize="small" />;
        break;
      case 'Legal Filing':
        color = 'secondary';
        icon = <FolderOpenIcon fontSize="small" />;
        break;
      default:
        break;
    }
    
    return { color, icon };
  }
  
  function DocumentList({ documents = [], isLoading }) {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
  
    // Handle empty state or loading
    if (isLoading) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Searching documents...
          </Typography>
        </Box>
      );
    }
  
    if (!documents || documents.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search filters or upload new documents
          </Typography>
        </Box>
      );
    }
  
    // Sort function
    const createSortHandler = (property) => (event) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    // Sorting logic
    function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
  
    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
  
    // Pagination handlers
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Apply sorting and pagination
    const sortedDocuments = documents.slice().sort(getComparator(order, orderBy));
    const paginatedDocuments = sortedDocuments.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  
    // Table headers configuration
    const headCells = [
      { id: 'type', numeric: false, disablePadding: false, label: 'Document Type' },
      { id: 'name', numeric: false, disablePadding: false, label: 'Filename' },
      { id: 'creditor', numeric: false, disablePadding: false, label: 'Creditor' },
      { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
      { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
      { id: 'score', numeric: true, disablePadding: false, label: 'Confidence' },
      { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', sortable: false },
    ];
    
    return (
      <Card variant="outlined">
        <CardHeader 
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">Search Results</Typography>
              <Chip 
                label={`${documents.length} document${documents.length !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            </Box>
          }
          sx={{ pb: 0, borderBottom: 1, borderColor: 'divider' }}
        />
        
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
          <Table sx={{ minWidth: 750 }} aria-labelledby="documentTableTitle" size="medium">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ fontWeight: 600 }}
                  >
                    {headCell.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {paginatedDocuments.map((doc, index) => {
                const { color, icon } = getDocumentTypeChip(doc.type);
                const isHighConfidence = doc.score > 0.9;
                
                return (
                  <TableRow
                    hover
                    key={doc.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: theme => theme.palette.action.hover 
                      },
                    }}
                    onClick={() => window.location.href = `/document/${doc.id}`}
                  >
                    <TableCell>
                      <Chip
                        icon={icon}
                        label={doc.type || 'Unknown'}
                        size="small"
                        color={color}
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            <Link
                              component={RouterLink}
                              to={`/document/${doc.id}`}
                              underline="hover"
                              color="inherit"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {doc.name}
                            </Link>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {doc.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      {doc.creditor || 'Unknown'}
                    </TableCell>
                    
                    <TableCell align="right">
                      {doc.amount ? (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: doc.amount > 500 ? 'error.main' : 'text.primary'
                          }}
                        >
                          ${doc.amount.toFixed(2)}
                        </Typography>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Tooltip title={doc.date || 'Unknown date'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon 
                            fontSize="small" 
                            sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} 
                          />
                          <Typography variant="body2">
                            {doc.date ? formatDistanceToNow(new Date(doc.date), { addSuffix: true }) : 'N/A'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Chip
                        label={`${(doc.score * 100).toFixed(0)}%`}
                        size="small"
                        color={isHighConfidence ? 'success' : 'default'}
                        variant={isHighConfidence ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Document">
                          <IconButton 
                            size="small" 
                            color="primary"
                            component={RouterLink}
                            to={`/document/${doc.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Original">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Download logic would go here
                              console.log('Download document', doc.id);
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={documents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
        />
      </Card>
    );
  }
  
  export default DocumentList;