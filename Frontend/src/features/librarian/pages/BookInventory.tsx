import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchBookInventoryWithDetails } from '../services/librarianService';

interface HistoryEntry {
  borrowedBy: string;
  checkoutDate: string;
  dueDate: string;
  status: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
  category: string;
  publishedDate?: string;
  currentHolder?: {
    name: string;
    email: string;
    checkoutDate: string;
    dueDate: string;
  } | null;
  history: HistoryEntry[];
}

const BookInventory: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getBooks = async () => {
      try {
        const data = await fetchBookInventoryWithDetails();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch book inventory');
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
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
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Book Inventory
      </Typography>

      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ input: { color: 'primary.main' } }}
      />

      {filteredBooks.map((book) => (
        <Accordion key={book._id} sx={{ mb: 2, border: '1px solid', borderColor: 'primary.light' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
            <Box>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>{book.title}</Typography>
              <Typography variant="body2" sx={{ color: 'primary.light' }}>
                by {book.author} — ISBN: {book.isbn}
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                Available: {book.availableCopies} / {book.totalCopies}
              </Typography>
              {book.currentHolder ? (
                <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                  Currently borrowed by {book.currentHolder.name} (due: {new Date(book.currentHolder.dueDate).toLocaleDateString()})
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                  Currently available
                </Typography>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {book.history.length > 0 ? (
              <Paper elevation={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ color: 'white' }}>Borrowed By</TableCell>
                      <TableCell sx={{ color: 'white' }}>Checkout Date</TableCell>
                      <TableCell sx={{ color: 'white' }}>Due Date</TableCell>
                      <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {book.history.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{entry.borrowedBy}</TableCell>
                        <TableCell>{new Date(entry.checkoutDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(entry.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <Typography variant="body2" sx={{ color: 'primary.light' }}>
                No transaction history available.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BookInventory;
