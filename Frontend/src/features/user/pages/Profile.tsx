import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../login/services/authService';
import TransactionService from '../../librarian/services/transactionService';

interface Transaction {
  _id: string;
  bookId: {
    _id: string;
    title: string;
  };
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
}

const Profile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { name = 'User', email = 'user@example.com', role = 'user', _id: userId } = user;
  const navigate = useNavigate();

  const [checkoutHistory, setCheckoutHistory] = useState<Transaction[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await TransactionService.getCheckoutHistory();
        setCheckoutHistory(transactionsResponse.data);

        const overdueResponse = await TransactionService.getOverdueHistory();
        setOverdueBooks(overdueResponse.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>

      <Typography variant="h6" gutterBottom color="#0284c7">
        📚 Checkout History
      </Typography>

      {checkoutHistory.length === 0 ? (
        <Typography color="text.secondary">No checkout history found.</Typography>
      ) : (
        <List>
          {checkoutHistory.map((transaction) => (
            <Paper
              key={transaction._id}
              sx={{
                mb: 2,
                p: 2,
                background: 'linear-gradient(135deg, #f0f9ff, #e0f7fa)',
                borderRadius: 3,
                boxShadow: '0 4px 8px rgba(14, 165, 233, 0.1)'
              }}
            >
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} color="#0c4a6e">
                      {transaction.bookId.title}
                    </Typography>
                  }
                  secondary={`Checked out: ${new Date(transaction.checkoutDate).toLocaleDateString()} | Due: ${new Date(transaction.dueDate).toLocaleDateString()}${transaction.returnDate ? ` | Returned: ${new Date(transaction.returnDate).toLocaleDateString()}` : ''}`}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom color="#0284c7">
        ⚠️ Overdue History
      </Typography>

      {overdueBooks.length === 0 ? (
        <Typography color="text.secondary">No overdue books found.</Typography>
      ) : (
        <List>
          {overdueBooks.map((book) => {
            const daysOverdue = !book.returnDate
              ? Math.floor((Date.now() - new Date(book.dueDate).getTime()) / (1000 * 60 * 60 * 24))
              : 0;

            return (
              <Paper
                key={book._id}
                sx={{
                  mb: 2,
                  p: 2,
                  background: 'linear-gradient(135deg, #ffe0e0, #fbe9e7)',
                  borderRadius: 3,
                  boxShadow: '0 4px 8px rgba(244, 67, 54, 0.1)'
                }}
              >
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600} color="#b71c1c">
                        {book.bookId.title}
                      </Typography>
                    }
                    secondary={`Checked out: ${new Date(book.checkoutDate).toLocaleDateString()} | Due: ${new Date(book.dueDate).toLocaleDateString()}${book.returnDate ? ` | Returned: ${new Date(book.returnDate).toLocaleDateString()}` : ` | Overdue by ${daysOverdue} day(s)`}`}
                  />
                </ListItem>
              </Paper>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Profile;
