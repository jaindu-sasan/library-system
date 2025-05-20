import api from '../../../lib/api';

const logout = async () => {
  try {
    const response = await api.post('/auth/logout', {}, {
      withCredentials: true
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  } catch (err) {
    console.error('Logout error:', err);
    // Still clear local storage even if server logout fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw err;
  }
};

const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (err) {
    console.error('Forgot password error:', err);
    throw err;
  }
};

const resetPassword = async (token: string, email: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, email, newPassword });
    return response.data;
  } catch (err) {
    console.error('Reset password error:', err);
    throw err;
  }
};

export default {
  logout,
  forgotPassword,
  resetPassword
};
