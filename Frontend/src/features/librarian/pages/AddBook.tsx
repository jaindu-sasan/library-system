import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addBook } from '../services/librarianService';

// Zod schema
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  totalCopies: z.number().min(1, 'Quantity must be at least 1'),
  category: z.string().min(1, 'Category is required'),
});

type BookFormData = z.infer<typeof bookSchema>;

const AddBook: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      totalCopies: 1,
      category: 'General',
    },
  });

  const onSubmit = async (data: BookFormData) => {
    setLoading(true);
    setError('');
    try {
      await addBook(data);
      setSuccess(true);
      reset({ title: '', author: '', isbn: '', totalCopies: 1, category: 'General' });
    } catch (err: any) {
      console.error('Add book error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add New Book
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            label="Author"
            margin="normal"
            {...register('author')}
            error={!!errors.author}
            helperText={errors.author?.message}
          />
          <TextField
            fullWidth
            label="ISBN"
            margin="normal"
            {...register('isbn')}
            error={!!errors.isbn}
            helperText={errors.isbn?.message}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            margin="normal"
            {...register('totalCopies', { valueAsNumber: true })}
            error={!!errors.totalCopies}
            helperText={errors.totalCopies?.message}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setValue('totalCopies', isNaN(value) ? 1 : Math.max(1, value));
            }}
          />
          <TextField
            fullWidth
            label="Category"
            margin="normal"
            {...register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          elevation={6}
          variant="filled"
          onClose={() => setSuccess(false)}
        >
          <Typography variant="h6">Success!</Typography>
          <Typography>The book has been added to the library.</Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={10000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          elevation={6}
          variant="filled"
          onClose={() => setError('')}
        >
          <Typography variant="h6">Error Adding Book</Typography>
          <Typography>{error}</Typography>
          <Typography>Please check the details and try again.</Typography>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddBook;
