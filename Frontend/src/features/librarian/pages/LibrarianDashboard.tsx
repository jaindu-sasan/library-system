import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  getBookCount,
  getUserCount,
  getOverdueBooks,
  getRecentCheckouts,
} from '../services/librarianService';

interface OverdueBook {
  _id: string;
  title: string;
  userId: { name: string };
  daysLate: number;
  fee: number;
}

interface CheckoutRecord {
  _id: string;
  bookTitle: string;
  userName: string;
  checkoutDate: string;
  dueDate: string;
  status: string;
}

const LibrarianDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
  const [recentActivity, setRecentActivity] = useState<CheckoutRecord[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const booksResponse = await getBookCount();
        const usersResponse = await getUserCount();
        const overdueResponse = await getOverdueBooks();
        const recentActivityResponse = await getRecentCheckouts();

        setTotalBooks(booksResponse.data.count);
        setTotalUsers(usersResponse.data.count);
        setOverdueBooks(overdueResponse.data);
        setRecentActivity(recentActivityResponse.data);
      } catch (err) {
        console.error('Failed to fetch statistics', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Librarian Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {[
          {
            title: 'Total Books',
            value: totalBooks,
            gradient: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
            shadow: '#8f94fb',
          },
          {
            title: 'Total Users',
            value: totalUsers,
            gradient: 'linear-gradient(135deg, #43cea2, #185a9d)',
            shadow: '#43cea2',
          },
          {
            title: 'Overdue Books',
            value: overdueBooks.length,
            gradient: 'linear-gradient(135deg, #f85032, #e73827)',
            shadow: '#f85032',
          },
        ].map((item, index) => (
          <Paper
            key={index}
            elevation={10}
            sx={{
              flex: '1 1 30%',
              p: 3,
              textAlign: 'center',
              minWidth: 200,
              borderRadius: '20px',
              background: item.gradient,
              color: '#fff',
              boxShadow: `0 8px 25px ${item.shadow}99`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 30px ${item.shadow}`,
              },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {item.title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          position: 'relative',
          zIndex: 0,
          borderRadius: 3,
          border: `1px solid ${isDark ? '#37474f' : '#90caf9'}`,
          background: isDark
            ? 'linear-gradient(145deg, #1e1e1e, #2c2c2c)'
            : 'linear-gradient(145deg, #e3f2fd, #ffffff)',
          boxShadow: isDark
            ? '0 4px 20px rgba(33, 33, 33, 0.5)'
            : '0 4px 20px rgba(144, 202, 249, 0.3)',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: isDark ? '#90caf9' : '#1565c0',
          }}
        >
          ✅ Quick Actions
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => navigate('/librarian/add-book')}
            sx={{
              backgroundColor: '#00bfa5',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(0, 191, 165, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#009688',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 18px rgba(0, 191, 165, 0.5)',
              },
            }}
          >
            Add Book
          </Button>

          <Button
            onClick={() => navigate('/librarian/manage-users',{ state: { openAddDialog: true } })}
            sx={{
              backgroundColor: '#3f51b5',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#303f9f',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 18px rgba(63, 81, 181, 0.5)',
              },
            }}
          >
            Add User
          </Button>
        </Stack>
      </Paper>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: isDark ? '#90caf9' : '#1565c0', mt: 4 }}
      >
        📖 Recent Book Activity
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: `1px solid ${isDark ? '#424242' : '#e0e0e0'}`,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: isDark ? '#263238' : '#e3f2fd',
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Checked Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Due</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentActivity.length > 0 ? (
              recentActivity.map((record) => (
                <TableRow
                  key={record._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? '#1e293b' : '#f1f8ff',
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell>{record.bookTitle}</TableCell>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>
                    {new Date(record.checkoutDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(record.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No recent activity found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: '#e53935' }}
      >
        ❗ Overdue Books
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(255, 112, 67, 0.1)',
          border: `1px solid ${isDark ? '#d32f2f55' : '#ffcdd2'}`,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: isDark ? '#311111' : '#ffebee',
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Book</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Days Late</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overdueBooks.length > 0 ? (
              overdueBooks.map((book) => (
                <TableRow
                  key={book._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? '#402020' : '#fff3e0',
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.userId.name}</TableCell>
                  <TableCell>{book.daysLate}</TableCell>
                  <TableCell>
                    {book.fee.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'LKR',
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No overdue books.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LibrarianDashboard;
