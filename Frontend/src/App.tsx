import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './features/login/pages/Login';
import ForgotPassword from './features/login/pages/ForgotPassword';
import ResetPassword from './features/login/pages/ResetPassword';
import Register from './features/login/pages/Register';
import LibrarianRegister from './features/login/pages/LibrarianRegister';
import LibrarianDashboard from './features/librarian/pages/LibrarianDashboard';
//import UserDashboard from './features/user/pages/SideNavBar';
import AddBook from './features/librarian/pages/AddBook';
import ManageUsers from './features/librarian/pages/ManageUsers';
import BookInventory from './features/librarian/pages/BookInventory';
//import CheckoutHistory from './features/librarian/pages/CheckoutHistory';
import LibrarianLayout from './features/librarian/components/LibrarianLayout';
import BrowseBooks from './features/user/pages/BrowseBooks';
import MyBooks from './features/user/pages/MyBooks';
import OverdueBooks from './features/user/pages/OverdueBooks';
//import BookDetails from './components/shared/BookDetails';
//import Profile from './components/shared/Profile';
import Userprofile from './features/user/pages/UserProfile';
import UserLayout from './features/user/components/userLayout';
//import Adduser from './features/librarian/pages/AddUser';
import { AuthProvider, useAuth } from './hooks/auth-hook';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated === undefined) {
    // Optional: handle loading or undefined state if needed
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                userRole === 'librarian' ? (
                  <Navigate to="/librarian" />
                ) : (
                  <Navigate to="/user" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/librarian-register" element={<LibrarianRegister />} />

          {/* Protected Librarian Routes */}
          <Route
            path="/librarian"
            element={
              isAuthenticated && userRole === 'librarian' ? (
                <LibrarianLayout />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route index element={<LibrarianDashboard />} />
            <Route path="add-book" element={<AddBook />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="book-inventory" element={<BookInventory />} />
          </Route>

          {/* Protected User Routes */}
          <Route
            path="/user"
            element={
              isAuthenticated && userRole === 'user' ? (
                <UserLayout />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route index element={<BrowseBooks />} />
            <Route path="browse-books" element={<BrowseBooks />} />
            <Route path="my-books" element={<MyBooks />} />
            <Route path="overdue-books" element={<OverdueBooks />} />
            <Route path="profile" element={<Userprofile />} />
          </Route>

          {/* Protected Shared Routes */}


        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
