import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  ReactElement,
} from 'react';
import authService from '../features/login/services/authService';
import UserService from '../services/userService';

// Define the structure of a User object
interface User {
  id: string;
  email: string;
  role: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Optional default context value (prevents undefined context access)
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  userRole: '',
  login: async () => {},
  logout: async () => {},
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await UserService.login({ email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      setUserRole(user.role);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Allow component to catch and handle
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      setUserRole('');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
