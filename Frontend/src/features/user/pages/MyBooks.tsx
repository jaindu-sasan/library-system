import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Paper
} from '@mui/material';
import userService from '../services/userService';

interface BorrowedBook {
  _id: string;
  bookId: {
    _id: string;
    title: string;
  };
  dueDate: string;
  status?: string;
}

const MyBooks: React.FC = () => {
  const [myBooks, setMyBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchMyBooks = async () => {
    try {
      const response = await userService.getMyBooks();
      setMyBooks(response.data);
    } catch (err) {
      setError('Failed to fetch your books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleReturn = async (transactionId: string) => {
    try {
      await userService.returnBook(transactionId);
      setSuccessMessage('Book returned successfully');
      fetchMyBooks();
    } catch (err) {
      setError('Failed to return book');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom color="#0ea5e9">
        📖 My Checked Out Books
      </Typography>

      {myBooks.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          You haven’t checked out any books.
        </Typography>
      ) : (
        <List sx={{ mt: 2 }}>
          {myBooks.map((book) => (
            <Paper
              key={book._id}
              elevation={3}
              sx={{
                mb: 2,
                p: 2,
                background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)'
              }}
            >
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, color: '#0c4a6e' }}>
                      {book.bookId.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                      </Typography>
                      {book.status === 'overdue' && (
                        <Chip label="Overdue" color="error" size="small" />
                      )}
                    </Box>
                  }
                />
              </ListItem>

              <Button
                size="small"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #0ea5e9, #38bdf8)',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0284c7, #0ea5e9)'
                  }
                }}
                onClick={() => handleReturn(book._id)}
              >
                Return
              </Button>
            </Paper>
          ))}
        </List>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyBooks;

