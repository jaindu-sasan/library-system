import api from '../../../lib/api';

const TransactionService = {
  checkoutBook: async (bookId: string, userId: string) => {
    return api.post('/transactions/checkout', { bookId, userId });
  },

  returnBook: async (transactionId: string) => {
    return api.post('/user/books/return', { transactionId });
  },

  getUserTransactions: async () => {
    return api.get('/user/books/my');
  },

  getOverdueTransactions: async () => {
    return api.get('/user/books/overdue');
  },

  getAllTransactions: async () => {
    return api.get('/transactions');
  },

  updateFeeStatus: async (transactionId: string, status: string) => {
    return api.put(`/transactions/fee/${transactionId}`, { status });
  },

  getCheckoutHistory: async () => {
    return api.get('/user/transactions/history');
  },

  getOverdueHistory: async () => {
    return api.get('/user/transactions/overdue');
  }
};

export default TransactionService;
