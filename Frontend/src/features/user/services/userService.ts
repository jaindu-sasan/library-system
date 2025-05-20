import api from '../../../lib/api';

interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  libraryId?: string;
}

const UserService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (!response.data.user) {
      throw new Error('User data not received');
    }
    return {
      token: response.data.token,
      user: response.data.user
    };
  },

  register: async (userData: User) => {
    return api.post('/auth/register', userData);
  },

  registerLibrarian: async (userData: User) => {
    return api.post('/auth/register/librarian', userData);
  },

  getCurrentUser: async () => {
    return api.get('/user/me');
  },

  updateUser: async (id: string, userData: User) => {
    return api.put(`/user/${id}`, userData);
  },

  getAllUsers: async () => {
    return api.get('/user');
  },

  deleteUser: async (id: string) => {
    return api.delete(`/user/${id}`);
  },

  // Book operations
  browseBooks: async (searchParams: { title?: string; author?: string; category?: string }) => {
    const { title, author, category } = searchParams;
    const query = new URLSearchParams();

    if (title) query.append('title', title);
    if (author) query.append('author', author);
    if (category) query.append('category', category);

    return api.get(`/user/books?${query.toString()}`);
  },

  getAvailableTitles: async () => {
    return api.get('/user/books/titles'); // Placeholder for actual API endpoint
  },

  getAvailableAuthors: async () => {
    return api.get('/user/books/authors'); // Placeholder for actual API endpoint
  },

  getMyBooks: async () => {
    return api.get('/user/books/my');
  },

  getOverdueBooks: async () => {
    return api.get('/user/books/overdue');
  },

  checkoutBook: async (bookId: string) => {
    return api.post('/user/books/checkout', { bookId });
  },
  
  returnBook: async (transactionId: string) => {
    return api.post('/user/books/return', { transactionId });
  }
};

export default UserService;

