import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import CreateUserPage from './pages/CreateUserPage';
import CreateTaskPage from './pages/CreateTaskPage';
import TaskDetailsPage from './pages/TaskDetailsPage';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App d-flex flex-column min-vh-100">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow-1 ${isAuthPage ? 'auth-main' : 'container-fluid py-4'}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/create" 
            element={
              <ProtectedRoute>
                <CreateTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/:id" 
            element={
              <ProtectedRoute>
                <TaskDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin/Manager only routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requireAuth={true}>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create" 
            element={
              <ProtectedRoute requireAuth={true}>
                <CreateUserPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route 
            path="*" 
            element={
              <div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-6 text-center">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle fa-3x mb-3"></i>
                      <h4>Page Not Found</h4>
                      <p>The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn btn-primary">
                        <i className="fas fa-home me-2"></i>
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;