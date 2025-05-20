import api from '../../../lib/api';

export const fetchBookInventory = async () => {
  try {
    const response = await api.get('/librarian/books');
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        message: string;
        config?: { url?: string; method?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Detailed API Error:', {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data
      });
    } else {
      console.error('Unexpected API Error:', err);
    }
    throw err;
  }
};

export const addBook = async (bookData: {
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  category: string;
}) => {
  console.log('Submitting book data:', bookData);
  try {
    const response = await api.post('/librarian/books', bookData);
    console.log('Add book response:', response);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        message: string;
        config?: { url?: string; method?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Detailed API Error:', {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data
      });
    } else {
      console.error('Unexpected API Error:', err);
    }
    throw err;
  }
};

export const createUser = async (userData: {
  name: string;
  email: string;
  role: string;
  password: string;
}) => {
  try {
    const response = await api.post('/librarian/users', userData);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        message: string;
        config?: { url?: string; method?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Detailed API Error:', {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data
      });
    } else {
      console.error('Unexpected API Error:', err);
    }
    throw err;
  }
};

export const toggleUserStatus = async (userId: string) => {
  try {
    const response = await api.put(`/librarian/users/${userId}/status`);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        message: string;
        config?: { url?: string; method?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Detailed API Error:', {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data
      });
    } else {
      console.error('Unexpected API Error:', err);
    }
    throw err;
  }
};

export const updateUser = async (
  userId: string, 
  userData: {
    name: string;
    email: string;
    role: string;
  }
) => {
  try {
    const response = await api.put(`/librarian/users/${userId}`, userData);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const axiosError = err as {
        message: string;
        config?: { url?: string; method?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Detailed API Error:', {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data
      });
    } else {
      console.error('Unexpected API Error:', err);
    }
    throw err;
  }
};

export const fetchBookInventoryWithDetails = async () => {
  const response = await api.get('/librarian/books');
  return response.data;
};

export const getBookCount = () => api.get('/librarian/bookcount');
export const getOverdueBooks = () => api.get('/librarian/overdue');
export const getRecentCheckouts = () => api.get('/librarian/recent-checkouts');
export const getUserCount = () => api.get('/librarian/usercount');

