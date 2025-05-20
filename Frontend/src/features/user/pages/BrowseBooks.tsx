import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import userService from '../services/userService';

interface Book {
  _id: string;
  title: string;
  author: string;
  availableCopies: number;
  category: string;
}

const BrowseBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await userService.browseBooks({
        title: searchType === 'title' ? searchTerm : '',
        author: searchType === 'author' ? searchTerm : '',
        category: searchType === 'category' ? searchTerm : ''
      });
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchBooks();
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom color="#0ea5e9">
        Browse Books
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(90deg, #e0f2fe, #f0f9ff)',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)'
        }}
      >
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchType}
            label="Search By"
            onChange={(e) => setSearchType(e.target.value)}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            background: 'linear-gradient(45deg, #0ea5e9, #38bdf8)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 3px 10px rgba(14, 165, 233, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0284c7, #0ea5e9)'
            }
          }}
        >
          🔍 Search
        </Button>
      </Box>

      {books.length === 0 ? (
        <Typography sx={{ mt: 2, color: '#64748b', fontStyle: 'italic' }}>
          No books found matching your search.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {books.map((book) => (
            <Card
              key={book._id}
              sx={{
                background: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)',
                boxShadow: '0 6px 20px rgba(14, 165, 233, 0.1)',
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0c4a6e' }}>
                  {book.title}
                </Typography>
                <Typography color="text.secondary">{book.author}</Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, mb: 1 }}
                  color="text.secondary"
                >
                  Category: <strong>{book.category}</strong>
                </Typography>

                <Chip
                  label={
                    book.availableCopies > 0
                      ? `${book.availableCopies} Available`
                      : 'Unavailable'
                  }
                  color={book.availableCopies > 0 ? 'success' : 'error'}
                  variant="outlined"
                />
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={book.availableCopies <= 0}
                  onClick={async () => {
                    try {
                      await userService.checkoutBook(book._id);
                      setSuccessMessage(`✅ Checked out "${book.title}"`);
                      fetchBooks();
                    } catch (err) {
                      setError('Failed to checkout book');
                      console.error(err);
                    }
                  }}
                  sx={{
                    background: book.availableCopies > 0
                      ? 'linear-gradient(45deg, #0ea5e9, #38bdf8)'
                      : '#ccc',
                    color: '#fff',
                    fontWeight: 600,
                    '&:hover': {
                      background: book.availableCopies > 0
                        ? 'linear-gradient(45deg, #0284c7, #0ea5e9)'
                        : '#bbb'
                    }
                  }}
                >
                  {book.availableCopies > 0 ? 'Check Out' : 'Unavailable'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
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

export default BrowseBooks;
