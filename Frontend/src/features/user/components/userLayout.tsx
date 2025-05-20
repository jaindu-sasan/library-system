import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import UserProfileBar from './UserProfileBar';

const navItems = [
  { text: 'Browse Books', path: '/user/browse-books' },
  { text: 'My Checked Out Books', path: '/user/my-books' },
  { text: 'Overdue Books', path: '/user/overdue-books' },
  { text: 'My Profile', path: '/user/profile' },
];

const UserLayout: React.FC = () => {
  const location = useLocation();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f0f9ff' }}>
      {/* Top Profile Bar */}
      <UserProfileBar />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Light Blue Side Navigation */}
        <Box
          sx={{
            width: 240,
            bgcolor: '#e0f2fe', // Light blue
            color: '#0369a1', // Deep sky blue text
            borderRight: '1px solid #bae6fd',
            height: 'calc(100vh - 64px)',
            position: 'sticky',
            top: '64px',
            overflowY: 'auto',
          }}
        >
          <Divider sx={{ borderColor: '#bae6fd' }} />
          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    pl: 2,
                    color: isActive ? '#0284c7' : '#0c4a6e',
                    bgcolor: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(14, 165, 233, 0.2)',
                      color: '#0284c7',
                      boxShadow: '0 0 6px #7dd3fc',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(14, 165, 233, 0.25)',
                      borderLeft: '4px solid #0ea5e9',
                      pl: 2,
                      boxShadow: '0 0 10px #0ea5e9aa',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 500,
                      fontFamily: 'Poppins, Roboto, sans-serif',
                      letterSpacing: 0.4,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', color: '#0f172a' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
