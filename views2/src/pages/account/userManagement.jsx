import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Alert,
  Fade,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Custom styled components to match Natours aesthetic
const NatoursCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 1rem 2rem rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0 1.5rem 3rem rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const NatoursButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 20px',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const NatoursPrimaryButton = styled(NatoursButton)(({ theme }) => ({
  background: 'linear-gradient(to right bottom, #7dd56f, #28b487)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(to right bottom, #6bc45f, #1e9d73)',
  },
}));

const NatoursSecondaryButton = styled(NatoursButton)(({ theme }) => ({
  border: '1px solid #28b487',
  color: '#28b487',
  '&:hover': {
    backgroundColor: 'rgba(40, 180, 135, 0.1)',
  },
}));

const NatoursTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#28b487',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#28b487',
    },
  },
}));

const NatoursTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  '& .MuiTableCell-root': {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  '& .MuiTableHead-root': {
    backgroundColor: '#f7f7f7',
    '& .MuiTableCell-root': {
      fontWeight: 600,
      color: '#333',
    },
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(40, 180, 135, 0.05)',
  },
}));

const NatoursChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '50px',
  fontWeight: 500,
  ...(status === 'active' && {
    backgroundColor: 'rgba(125, 213, 111, 0.2)',
    color: '#28b487',
  }),
  ...(status === 'inactive' && {
    backgroundColor: 'rgba(255, 119, 119, 0.2)',
    color: '#ff5252',
  }),
}));

const UserSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  role: Yup.string().required('Role is required'),
});

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/v1/users/');

      const sanitizedUsers = response.data.data.data.map((user) => ({
        id: user._id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        active: user.active !== undefined ? user.active : true,
        createdAt: user.createdAt || new Date().toISOString(),
        avatar: user.photo || null,
      }));

      setUsers(sanitizedUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const firstName = user.firstName?.toLowerCase() || '';
    const lastName = user.lastName?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      firstName.includes(search) ||
      lastName.includes(search) ||
      email.includes(search);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'inactive' && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${
      lastName?.charAt(0) || ''
    }`.toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { bgcolor: '#ff5252', color: 'white' }; // Red
      case 'lead-guide':
        return { bgcolor: '#ffb900', color: 'white' }; // Orange
      case 'guide':
        return { bgcolor: '#ffd700', color: 'white' }; // Yellow
      case 'user':
        return { bgcolor: '#28b487', color: 'white' }; // Green
      default:
        return { bgcolor: '#7dd56f', color: 'white' }; // Light green
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (user = null) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (currentUser) {
        await axios.patch(`/api/v1/users/${currentUser.id}`, values);
        setSuccess('User updated successfully!');
      } else {
        await axios.post('/api/v1/users', values);
        setSuccess('User created successfully!');
      }

      fetchUsers();
      handleCloseDialog();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
      console.error('Error saving user:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      try {
        await axios.delete(`/api/v1/users/${userId}`);
        setSuccess('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/v1/users/${userId}/status`, {
        active: !currentStatus,
      });
      setSuccess(
        `User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`
      );
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
      console.error('Error toggling user status:', err);
    }
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Header Section */}
          <Box mb={4}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight={700}
              color="#333"
              sx={{
                backgroundImage: 'linear-gradient(to right, #7dd56f, #28b487)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              User Management
            </Typography>
            <Typography variant="subtitle1" color="#777">
              Manage all users, their roles and permissions
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: '50px' }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Fade>
          )}
          {success && (
            <Fade in={!!success}>
              <Alert
                severity="success"
                sx={{ mb: 3, borderRadius: '50px' }}
                onClose={() => setSuccess(null)}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Main Card */}
          <NatoursCard>
            <CardContent sx={{ p: 4 }}>
              {/* Action Bar */}
              <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                gap={2}
                mb={4}
                alignItems={{ xs: 'stretch', md: 'center' }}
              >
                <Box flex={1}>
                  <NatoursTextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                  <NatoursTextField
                    select
                    label="Role"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    size="small"
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="lead-guide">Lead Guide</MenuItem>
                    <MenuItem value="guide">Guide</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </NatoursTextField>

                  <NatoursTextField
                    select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </NatoursTextField>

                  <NatoursPrimaryButton
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add User
                  </NatoursPrimaryButton>
                </Box>
              </Box>

              {/* Stats Row */}
              <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <NatoursChip
                  label={`Total: ${users.length}`}
                  variant="outlined"
                  sx={{ borderColor: '#28b487', color: '#28b487' }}
                />
                <NatoursChip
                  label={`Active: ${users.filter((u) => u.active).length}`}
                  status="active"
                />
                <NatoursChip
                  label={`Inactive: ${users.filter((u) => !u.active).length}`}
                  status="inactive"
                />
              </Box>

              <Divider sx={{ mb: 3, borderColor: 'rgba(0, 0, 0, 0.05)' }} />

              {/* Table Section */}
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress size={48} sx={{ color: '#28b487' }} />
                </Box>
              ) : error && users.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '12px',
                  }}
                >
                  <Typography color="error" variant="h6" gutterBottom>
                    {error}
                  </Typography>
                  <NatoursPrimaryButton
                    startIcon={<RefreshIcon />}
                    onClick={fetchUsers}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </NatoursPrimaryButton>
                </Paper>
              ) : (
                <>
                  <NatoursTable>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.length > 0 ? (
                          paginatedUsers.map((user) => (
                            <TableRow
                              key={user.id}
                              sx={{
                                '&:nth-of-type(even)': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.01)',
                                },
                              }}
                            >
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Avatar
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      ...getRoleColor(user.role),
                                    }}
                                  >
                                    {user.avatar ? (
                                      <img
                                        src={`img/users/${user.avatar}`}
                                        alt={user.firstName}
                                      />
                                    ) : (
                                      getUserInitials(
                                        user.firstName,
                                        user.lastName
                                      )
                                    )}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                    >
                                      {`${user.firstName} ${user.lastName}`}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Joined:{' '}
                                      {new Date(
                                        user.createdAt
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {user.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={user.role}
                                  size="small"
                                  sx={{
                                    backgroundColor: getRoleColor(user.role)
                                      .bgcolor,
                                    color: getRoleColor(user.role).color,
                                    fontWeight: 500,
                                    borderRadius: '4px',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <NatoursChip
                                  icon={
                                    user.active ? (
                                      <CheckCircleIcon fontSize="small" />
                                    ) : (
                                      <CancelIcon fontSize="small" />
                                    )
                                  }
                                  label={user.active ? 'Active' : 'Inactive'}
                                  status={user.active ? 'active' : 'inactive'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  display="flex"
                                  gap={1}
                                  justifyContent="center"
                                >
                                  <Tooltip title="Edit User">
                                    <IconButton
                                      sx={{
                                        color: '#555',
                                        '&:hover': {
                                          color: '#28b487',
                                          backgroundColor:
                                            'rgba(40, 180, 135, 0.1)',
                                        },
                                      }}
                                      onClick={() => handleOpenDialog(user)}
                                      size="small"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      user.active
                                        ? 'Deactivate User'
                                        : 'Activate User'
                                    }
                                  >
                                    <IconButton
                                      sx={{
                                        color: user.active
                                          ? '#ffb900'
                                          : '#28b487',
                                        '&:hover': {
                                          backgroundColor: user.active
                                            ? 'rgba(255, 185, 0, 0.1)'
                                            : 'rgba(40, 180, 135, 0.1)',
                                        },
                                      }}
                                      onClick={() =>
                                        handleToggleStatus(user.id, user.active)
                                      }
                                      size="small"
                                    >
                                      {user.active ? (
                                        <CancelIcon />
                                      ) : (
                                        <CheckCircleIcon />
                                      )}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete User">
                                    <IconButton
                                      sx={{
                                        color: '#ff5252',
                                        '&:hover': {
                                          backgroundColor:
                                            'rgba(255, 82, 82, 0.1)',
                                        },
                                      }}
                                      onClick={() => handleDeleteUser(user.id)}
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              sx={{ py: 8 }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={2}
                              >
                                <PersonIcon
                                  sx={{ fontSize: 48, color: 'text.secondary' }}
                                />
                                <Typography variant="h6" color="text.secondary">
                                  No users found
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {searchTerm ||
                                  roleFilter !== 'all' ||
                                  statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by adding your first user'}
                                </Typography>
                                <NatoursPrimaryButton
                                  onClick={() => handleOpenDialog()}
                                  startIcon={<AddIcon />}
                                >
                                  Add User
                                </NatoursPrimaryButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </NatoursTable>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={{ xs: 2, sm: 0 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Showing{' '}
                      {paginatedUsers.length > 0 ? page * rowsPerPage + 1 : 0}{' '}
                      to{' '}
                      {Math.min((page + 1) * rowsPerPage, filteredUsers.length)}{' '}
                      of {filteredUsers.length} users
                    </Typography>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={filteredUsers.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        '& .MuiTablePagination-toolbar': {
                          paddingLeft: 0,
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </NatoursCard>
        </Grid>
      </Grid>

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            py: 3,
            backgroundColor: '#28b487',
            color: 'white',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {currentUser ? 'Edit User' : 'Add New User'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {currentUser
              ? 'Update user information'
              : 'Fill in the details below to create a new user'}
          </Typography>
        </DialogTitle>

        <Formik
          initialValues={{
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            email: currentUser?.email || '',
            role: currentUser?.role || 'user',
          }}
          validationSchema={UserSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <DialogContent dividers sx={{ py: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={NatoursTextField}
                      fullWidth
                      name="firstName"
                      label="First Name"
                      variant="outlined"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={NatoursTextField}
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={NatoursTextField}
                      fullWidth
                      name="email"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      disabled={!!currentUser}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={NatoursTextField}
                      fullWidth
                      name="role"
                      label="User Role"
                      select
                      variant="outlined"
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                    >
                      <MenuItem value="admin">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: '#ff5252',
                            }}
                          />
                          <Typography>Admin</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="lead-guide">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: '#ffb900',
                            }}
                          />
                          <Typography>Lead Guide</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="guide">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: '#ffd700',
                            }}
                          />
                          <Typography>Guide</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="user">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: '#28b487',
                            }}
                          />
                          <Typography>User</Typography>
                        </Box>
                      </MenuItem>
                    </Field>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 3, gap: 1 }}>
                <NatoursSecondaryButton onClick={handleCloseDialog}>
                  Cancel
                </NatoursSecondaryButton>
                <NatoursPrimaryButton
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : currentUser ? (
                    'Update User'
                  ) : (
                    'Create User'
                  )}
                </NatoursPrimaryButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;
