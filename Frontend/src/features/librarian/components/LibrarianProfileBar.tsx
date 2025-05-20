import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth-hook'; // Adjust path as needed

const LibrarianProfileBar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { name = 'User', email = 'user@example.com', role = 'user' } = user;
  const navigate = useNavigate();
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
          Librarian Panel
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#bae6fd',
            color: '#0c4a6e',
            fontWeight: 600,
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="subtitle1" sx={{ color: '#0369a1', fontWeight: 500 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: 13 }}>
            {email}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            borderColor: '#0284c7',
            color: '#0284c7',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#bae6fd',
              boxShadow: '0 0 6px #38bdf877',
              borderColor: '#0ea5e9',
              color: '#0ea5e9',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default LibrarianProfileBar;
