import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import TransactionService from '../../librarian/services/transactionService';
import { useNotification } from '../../../components/shared/Notification';

interface OverdueBook {
  _id: string;
  bookId: {
    _id: string;
    title: string;
  };
  dueDate: string;
  returnDate?: string;
  daysOverdue?: number;
  overdueFee?: number;
}

const OverdueBooks: React.FC = () => {
  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const response = await TransactionService.getOverdueTransactions();
        const feePerDay = 1;

        const booksWithFees = response.data.map((book: OverdueBook) => {
          const dueDate = new Date(book.dueDate);
          const now = new Date();
          const diffTime = now.getTime() - dueDate.getTime();
          const daysOverdue = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0);
          const overdueFee = daysOverdue * feePerDay;
          return { ...book, daysOverdue, overdueFee };
        });

        setOverdueBooks(booksWithFees);
      } catch (err) {
        setError('Failed to fetch overdue books');
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  const handleReturn = async (transactionId: string) => {
    try {
      await TransactionService.returnBook(transactionId);
      showNotification('Book returned successfully', 'success');
      const response = await TransactionService.getOverdueTransactions();

      const feePerDay = 1;
      const booksWithFees = response.data.map((book: OverdueBook) => {
        const dueDate = new Date(book.dueDate);
        const now = new Date();
        const diffTime = now.getTime() - dueDate.getTime();
        const daysOverdue = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0);
        const overdueFee = daysOverdue * feePerDay;
        return { ...book, daysOverdue, overdueFee };
      });

      setOverdueBooks(booksWithFees);
    } catch (err: any) {
      console.error('Return book error:', err.response?.data || err.message || err);
      showNotification('Failed to return book', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom color="#0284c7" fontWeight={600}>
        ⚠️ Overdue Books
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Please return overdue books to avoid late fees.
      </Alert>

      {overdueBooks.length === 0 ? (
        <Alert severity="info">No overdue books found.</Alert>
      ) : (
        <List>
          {overdueBooks.map((book) => (
            <Paper
              key={book._id}
              sx={{
                mb: 2,
                p: 2,
                background: 'linear-gradient(135deg, #f0f9ff, #e0f7fa)',
                borderLeft: '5px solid #0ea5e9',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)'
              }}
            >
              <ListItem disableGutters secondaryAction={
                !book.returnDate && (
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleReturn(book._id)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none'
                    }}
                  >
                    Return Now
                  </Button>
                )
              }>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} color="#0c4a6e">
                      {book.bookId.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(book.dueDate).toLocaleDateString()}<br />
                      Overdue: {book.daysOverdue} day(s), Fee: LKR{book.overdueFee}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default OverdueBooks;

