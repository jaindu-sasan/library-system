import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useAuth } from '../../../hooks/auth-hook';

const UserProfileBar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { name = 'User', email = 'user@example.com', role = 'user' } = user;

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Attempting logout...');
      await logout();
      console.log('Logout successful, redirecting...');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed. Please try again.');
      window.location.href = '/';
    }
  };

  return (
    <Box
      sx={{
        zIndex: 5,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#e0f2fe',
        borderBottom: '1px solid #bae6fd',
        p: 1,
        px: 3,
        height: 64,
        justifyContent: 'space-between',
        color: '#0c4a6e',
        fontFamily: 'Poppins, Roboto, sans-serif',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 600,
            color: '#0284c7',
            letterSpacing: 0.5,
          }}
        >
          User Panel
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#0284c7',
            color: '#e0f2fe',
            fontWeight: 600,
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="subtitle1" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#0369a1', fontSize: 13 }}>
            {email}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#fee2e2',
              boxShadow: '0 0 6px #f87171aa',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfileBar;
