import React, { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    totalUsers: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');

      let tasks = [];
      let users = [];

      // Fetch data based on user role
      if (user.role === 'Admin' || user.role === 'Manager') {
        // Admin/Manager can see all tasks and users
        const [tasksResponse, usersResponse] = await Promise.all([
          taskAPI.getAll(),
          userAPI.getAll()
        ]);
        tasks = tasksResponse.data;
        users = usersResponse.data;
      } else {
        // Regular users only see their own tasks
        const tasksResponse = await taskAPI.getMyTasks();
        tasks = tasksResponse.data;
        users = [user]; // Just current user for stats
      }

      // Calculate statistics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'Completed').length;
      const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
      const inProgressTasks = tasks.filter(task => task.status === 'InProgress').length;

      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        totalUsers: users.length
      });

      // Get recent tasks (last 5, sorted by creation date)
      const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentTasks(sortedTasks.slice(0, 5));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'inprogress': return 'bg-info';
      case 'pending': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0">
                Welcome back, <span className="text-primary">{user?.firstName}</span>! 👋
              </h1>
              <p className="text-muted mb-0">Here's what's happening with your tasks today.</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/tasks/create" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                New Task
              </Link>
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <Link to="/users/create" className="btn btn-outline-primary">
                  <i className="fas fa-user-plus me-2"></i>
                  New User
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row mb-5">
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-tasks fa-2x text-primary mb-2"></i>
              <h3 className="card-title">{stats.totalTasks}</h3>
              <p className="card-text text-muted">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
              <h3 className="card-title">{stats.completedTasks}</h3>
              <p className="card-text text-muted">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-clock fa-2x text-warning mb-2"></i>
              <h3 className="card-title">{stats.pendingTasks}</h3>
              <p className="card-text text-muted">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-play-circle fa-2x text-info mb-2"></i>
              <h3 className="card-title">{stats.inProgressTasks}</h3>
              <p className="card-text text-muted">In Progress</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-users fa-2x text-purple mb-2"></i>
              <h3 className="card-title">{stats.totalUsers}</h3>
              <p className="card-text text-muted">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card text-center card-hover">
            <div className="card-body">
              <i className="fas fa-percentage fa-2x text-secondary mb-2"></i>
              <h3 className="card-title">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </h3>
              <p className="card-text text-muted">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-12">
          <h3 className="mb-3">Quick Actions</h3>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/tasks/create" className="card card-hover text-decoration-none">
            <div className="card-body text-center">
              <i className="fas fa-plus-circle fa-2x text-primary mb-2"></i>
              <h5 className="card-title">Create New Task</h5>
              <p className="card-text text-muted">Add a new task to your list</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/users/create" className="card card-hover text-decoration-none">
            <div className="card-body text-center">
              <i className="fas fa-user-plus fa-2x text-success mb-2"></i>
              <h5 className="card-title">Add New User</h5>
              <p className="card-text text-muted">Register a new user</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/tasks" className="card card-hover text-decoration-none">
            <div className="card-body text-center">
              <i className="fas fa-list fa-2x text-info mb-2"></i>
              <h5 className="card-title">View All Tasks</h5>
              <p className="card-text text-muted">Browse and manage tasks</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/users" className="card card-hover text-decoration-none">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x text-warning mb-2"></i>
              <h5 className="card-title">Manage Users</h5>
              <p className="card-text text-muted">View and edit user accounts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Recent Tasks</h3>
            <Link to="/tasks" className="btn btn-outline-primary btn-sm">
              View All Tasks
            </Link>
          </div>
          
          {recentTasks.length === 0 ? (
            <div className="card">
              <div className="card-body text-center text-muted py-5">
                <i className="fas fa-inbox fa-3x mb-3"></i>
                <p>No tasks available. <Link to="/tasks/create">Create your first task</Link></p>
              </div>
            </div>
          ) : (
            <div className="row">
              {recentTasks.map((task) => (
                <div key={task.taskId} className="col-md-6 col-lg-4 mb-3">
                  <div className="card task-card card-hover">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title task-title mb-0">{task.title}</h6>
                        <span className={`badge ${getPriorityBadgeClass(task.priority)} ms-2`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="card-text task-description">
                        {task.description.length > 80 
                          ? `${task.description.substring(0, 80)}...` 
                          : task.description
                        }
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                          {task.status}
                        </span>
                        <small className="text-muted">{formatDate(task.createdAt)}</small>
                      </div>
                      
                      <div className="mt-3">
                        <Link 
                          to={`/tasks/${task.taskId}`} 
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;