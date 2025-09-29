import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-tasks me-2"></i>
          Task Manager
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            // Authenticated user navigation
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} to="/">
                    <i className="fas fa-home me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/tasks')}`} to="/tasks">
                    <i className="fas fa-list me-1"></i>
                    My Tasks
                  </Link>
                </li>
                {user && (user.role === 'Admin' || user.role === 'Manager') && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/users')}`} to="/users">
                      <i className="fas fa-users me-1"></i>
                      Manage Users
                    </Link>
                  </li>
                )}
              </ul>
              
              <div className="navbar-nav">
                {/* Create dropdown */}
                <div className="nav-item dropdown me-3">
                  <button 
                    className="btn btn-outline-light dropdown-toggle" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-plus me-1"></i>
                    Create
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/tasks/create">
                        <i className="fas fa-plus-circle me-2"></i>
                        New Task
                      </Link>
                    </li>
                    {user && (user.role === 'Admin' || user.role === 'Manager') && (
                      <li>
                        <Link className="dropdown-item" to="/users/create">
                          <i className="fas fa-user-plus me-2"></i>
                          New User
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                {/* User dropdown */}
                <div className="nav-item dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user me-1"></i>
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    <span className="badge bg-light text-primary ms-2">{user?.role}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user-circle me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile/change-password">
                        <i className="fas fa-key me-2"></i>
                        Change Password
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Signing Out...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Sign Out
                          </>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            // Guest navigation
            <div className="navbar-nav ms-auto">
              <Link className={`nav-link ${isActive('/login')}`} to="/login">
                <i className="fas fa-sign-in-alt me-1"></i>
                Sign In
              </Link>
              <Link className={`nav-link ${isActive('/register')}`} to="/register">
                <i className="fas fa-user-plus me-1"></i>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;