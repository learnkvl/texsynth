// src/components/case/CaseCreateForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Divider,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Grow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AttachMoney,
  CreditCard,
  MedicalInformation,
  Home,
  DirectionsCar,
  School,
  Person,
  Description,
  CheckCircle,
  Clear,
  Save,
  ArrowBack,
  People
} from '@mui/icons-material';

const CaseCreateForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    debtorName: '',
    client: '',
    accountType: '',
    principalAmount: '',
    interestAmount: '',
    status: 'pending',
    assignedTo: '',
    user: '',
    nextAction: '',
    nextActionDate: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Mock data for dropdowns
  const clients = ['ABC Collections', 'Healthcare Recovery', 'Auto Finance Recovery', 'Homeowner Solutions', 'Education Recovery'];
  const accountTypes = ['Credit Card', 'Medical', 'Auto Loan', 'Mortgage', 'Student Loan', 'Personal Loan'];
  const statuses = ['pending', 'active', 'legal', 'closed'];
  const assignees = ['Sarah Adams', 'Michael Johnson', 'John Doe'];
  const users = ['John Smith', 'Mary Johnson', 'Robert Williams', 'Jennifer Davis', 'Michael Brown', 'James Thompson', 'David Jackson'];
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Case name is required';
    if (!formData.debtorName) newErrors.debtorName = 'Debtor name is required';
    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    if (!formData.principalAmount || isNaN(formData.principalAmount)) newErrors.principalAmount = 'Valid amount is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assignee is required';
    if (!formData.user) newErrors.user = 'User is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    // In a real app, you would submit to your API here
    console.log('Form submitted:', formData);
    
    // Close dialog and navigate back
    setConfirmDialogOpen(false);
    navigate('/cases');
  };
  
  // Get icon for account type
  const getAccountTypeIcon = (type) => {
    switch(type) {
      case 'Credit Card': return <CreditCard />;
      case 'Medical': return <MedicalInformation />;
      case 'Auto Loan': return <DirectionsCar />;
      case 'Mortgage': return <Home />;
      case 'Student Loan': return <School />;
      default: return <AttachMoney />;
    }
  };
  
  // Get status chip
  const getStatusChip = (status) => {
    const statusColors = {
      pending: theme.palette.warning.main,
      active: theme.palette.primary.main,
      legal: theme.palette.error.main,
      closed: theme.palette.success.main
    };
    
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: statusColors[status] + '20',
          color: statusColors[status],
          border: `1px solid ${statusColors[status] + '50'}`,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
      >
        {status}
      </Box>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/cases')}
            sx={{ mr: 2 }}
          >
            Back to Cases
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Create New Case
          </Typography>
        </Box>
        
        <Grow in={true} timeout={600}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }}
          >
            <CardHeader
              title="Case Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                py: 2
              }}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Case Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Case Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      variant="filled"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Debtor Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Debtor Name"
                      name="debtorName"
                      value={formData.debtorName}
                      onChange={handleChange}
                      error={!!errors.debtorName}
                      helperText={errors.debtorName}
                      required
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Client */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.client} variant="filled">
                      <InputLabel>Client *</InputLabel>
                      <Select
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        label="Client *"
                        sx={{
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }}
                      >
                        {clients.map(client => (
                          <MenuItem key={client} value={client}>{client}</MenuItem>
                        ))}
                      </Select>
                      {errors.client && <FormHelperText>{errors.client}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  {/* Account Type */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.accountType} variant="filled">
                      <InputLabel>Account Type *</InputLabel>
                      <Select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        label="Account Type *"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1.5,
                                bgcolor: 'transparent',
                                color: theme.palette.primary.main
                              }}
                            >
                              {getAccountTypeIcon(selected)}
                            </Avatar>
                            {selected}
                          </Box>
                        )}
                        sx={{
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }}
                      >
                        {accountTypes.map(type => (
                          <MenuItem key={type} value={type}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1.5,
                                  bgcolor: 'transparent',
                                  color: theme.palette.primary.main
                                }}
                              >
                                {getAccountTypeIcon(type)}
                              </Avatar>
                              {type}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.accountType && <FormHelperText>{errors.accountType}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  {/* Amounts */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Principal Amount"
                      name="principalAmount"
                      value={formData.principalAmount}
                      onChange={handleChange}
                      error={!!errors.principalAmount}
                      helperText={errors.principalAmount}
                      required
                      type="number"
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Interest Amount"
                      name="interestAmount"
                      value={formData.interestAmount}
                      onChange={handleChange}
                      type="number"
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Status */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                        renderValue={(selected) => getStatusChip(selected)}
                        sx={{
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }}
                      >
                        {statuses.map(status => (
                          <MenuItem key={status} value={status}>
                            {getStatusChip(status)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Assigned To */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.assignedTo} variant="filled">
                      <InputLabel>Assigned To *</InputLabel>
                      <Select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        label="Assigned To *"
                        sx={{
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }}
                      >
                        {assignees.map(assignee => (
                          <MenuItem key={assignee} value={assignee}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1.5,
                                  fontSize: '0.8rem',
                                  bgcolor: theme.palette.primary.light,
                                  color: theme.palette.primary.dark
                                }}
                              >
                                {assignee.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              {assignee}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.assignedTo && <FormHelperText>{errors.assignedTo}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  {/* User */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.user} variant="filled">
                      <InputLabel>User *</InputLabel>
                      <Select
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        label="User *"
                        sx={{
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <People color="action" />
                          </InputAdornment>
                        }
                      >
                        {users.map(user => (
                          <MenuItem key={user} value={user}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  mr: 1.5,
                                  fontSize: '0.8rem',
                                  bgcolor: theme.palette.secondary.light,
                                  color: theme.palette.secondary.dark
                                }}
                              >
                                {user.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              {user}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.user && <FormHelperText>{errors.user}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  {/* Next Action */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Next Action"
                      name="nextAction"
                      value={formData.nextAction}
                      onChange={handleChange}
                      variant="filled"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Next Action Date */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Next Action Date"
                      name="nextActionDate"
                      type="date"
                      value={formData.nextActionDate}
                      onChange={handleChange}
                      variant="filled"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      variant="filled"
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[50],
                          '&:hover': {
                            bgcolor: theme.palette.grey[100]
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Clear />}
                    onClick={() => navigate('/cases')}
                    sx={{
                      px: 3,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<Save />}
                    sx={{
                      px: 3,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Create Case
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grow>
        
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              minWidth: 500
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              py: 2
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Confirm Case Creation
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography gutterBottom>
              Are you sure you want to create this new case?
            </Typography>
            <Card
              variant="outlined"
              sx={{
                mt: 2,
                borderRadius: 2,
                borderColor: theme.palette.divider
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Case Name
                    </Typography>
                    <Typography>{formData.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Debtor
                    </Typography>
                    <Typography>{formData.debtorName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client
                    </Typography>
                    <Typography>{formData.client}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getAccountTypeIcon(formData.accountType)}
                      <Box sx={{ ml: 1 }}>{formData.accountType}</Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Principal Amount
                    </Typography>
                    <Typography>${formData.principalAmount}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    {getStatusChip(formData.status)}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      User
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          fontSize: '0.8rem',
                          bgcolor: theme.palette.secondary.light,
                          color: theme.palette.secondary.dark
                        }}
                      >
                        {formData.user.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography>{formData.user}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                px: 3,
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              startIcon={<CheckCircle />}
              sx={{
                px: 3,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                }
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CaseCreateForm;