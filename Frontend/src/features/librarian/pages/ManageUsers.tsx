import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomButton from '../../../components/common/CustomButton';
import userService from '../services/userService';
import {
  createUser,
  toggleUserStatus,
  updateUser
} from '../services/librarianService';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['user', 'librarian']),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'librarian';
  isActive: boolean;
}

const ManageUsers: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (location.state?.openAddDialog) {
      handleOpenDialog();
    }
  }, [location.state]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditing(false);
    setEditingUserId(null);
    setSuccessMessage('');
    reset({ name: '', email: '', role: 'user', password: '' });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingUserId(null);
    reset();
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && editingUserId) {
        const { password, ...rest } = data;
        const updatePayload = password ? data : rest;
        await updateUser(editingUserId, updatePayload);
        setSuccessMessage('User updated successfully!');
      } else {
        if (!data.password) {
          setError('Password is required for new user');
          return;
        }
        await createUser(data as Required<UserFormData>);
        setSuccessMessage('User created successfully!');
      }

      const usersResponse = await userService.getAllUsers();
      setUsers(usersResponse.data);
      handleCloseDialog();
    } catch (err) {
      setError(isEditing ? 'Failed to update user' : 'Failed to create user');
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      const usersResponse = await userService.getAllUsers();
      setUsers(usersResponse.data);
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  const handleEditUser = (user: User) => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditing(true);
    setEditingUserId(user._id);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <CustomButton onClick={handleOpenDialog}>Add User</CustomButton>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#0288d1', color: 'white' }}>
          {isEditing ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Full Name"
                fullWidth
                variant="standard"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                disabled={isEditing}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Role">
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="librarian">Librarian</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <CustomButton onClick={handleCloseDialog} variant="outlined" color="primary">
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)} sx={{ bgcolor: '#0288d1' }}>
            {isEditing ? 'Update' : 'Create'}
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, overflow: 'auto', p: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#e3f2fd' }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'librarian' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'active' : 'inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <CustomButton size="small" onClick={() => handleEditUser(user)} variant="text">
                    Edit
                  </CustomButton>
                  <CustomButton
                    size="small"
                    color={user.isActive ? 'error' : 'success'}
                    onClick={() => handleToggleStatus(user._id)}
                    variant="text"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </CustomButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default ManageUsers;