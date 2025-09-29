import React, { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedStatus, selectedCategory, selectedUser, user]);

  const fetchInitialData = async () => {
    try {
      // Only fetch users if current user is Admin or Manager
      if (user && (user.role === 'Admin' || user.role === 'Manager')) {
        const usersResponse = await userAPI.getAll();
        setUsers(usersResponse.data);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');

      let response;
      
      // For Admin/Manager users, allow filtering by different criteria
      if (user.role === 'Admin' || user.role === 'Manager') {
        if (selectedStatus !== 'all') {
          response = await taskAPI.getByStatus(selectedStatus);
        } else if (selectedCategory !== 'all') {
          response = await taskAPI.getByCategory(selectedCategory);
        } else if (selectedUser !== 'all') {
          response = await taskAPI.getByUser(selectedUser);
        } else {
          response = await taskAPI.getAll();
        }
      } else {
        // For regular users, only show their own tasks
        response = await taskAPI.getMyTasks();
      }

      let tasksData = response.data;

      // Apply additional client-side filtering if needed
      if (selectedStatus !== 'all' && selectedCategory !== 'all') {
        tasksData = tasksData.filter(task => task.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (selectedStatus !== 'all' && selectedUser !== 'all') {
        tasksData = tasksData.filter(task => task.userId.toString() === selectedUser);
      }
      if (selectedCategory !== 'all' && selectedUser !== 'all') {
        tasksData = tasksData.filter(task => task.userId.toString() === selectedUser);
      }

      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      // Update local state
      setTasks(tasks.map(task => 
        task.taskId === taskId 
          ? { ...task, status: newStatus, completedAt: newStatus === 'Completed' ? new Date().toISOString() : null }
          : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      try {
        await taskAPI.delete(taskId);
        setTasks(tasks.filter(task => task.taskId !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(tasks.map(task => task.category))];
    return categories.sort();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="fas fa-tasks me-2"></i>
            {user && (user.role === 'Admin' || user.role === 'Manager') ? 'Task Management' : 'My Tasks'}
          </h2>
          <p className="text-muted">
            {user && (user.role === 'Admin' || user.role === 'Manager') 
              ? 'View and manage all tasks in the system'
              : `Welcome back, ${user?.firstName}! Here are your personal tasks.`
            }
          </p>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/tasks/create" className="btn btn-primary">
            <i className="fas fa-plus-circle me-2"></i>
            Add New Task
          </Link>
        </div>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Filters - Show different filters based on user role */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
          <select
            id="statusFilter"
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
          <select
            id="categoryFilter"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* User filter - only show for Admin/Manager */}
        {user && (user.role === 'Admin' || user.role === 'Manager') && (
          <div className="col-md-3">
            <label htmlFor="userFilter" className="form-label">Filter by User:</label>
            <select
              id="userFilter"
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="all">All Users</option>
              {users.map(userItem => (
                <option key={userItem.userId} value={userItem.userId}>
                  {userItem.firstName} {userItem.lastName}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className={user && (user.role === 'Admin' || user.role === 'Manager') ? "col-md-3" : "col-md-6"}>
          <div className="d-flex align-items-end h-100">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSelectedUser('all');
              }}
            >
              <i className="fas fa-undo me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center text-muted py-5">
            <i className="fas fa-tasks fa-3x mb-3"></i>
            <p>No tasks found. <Link to="/tasks/create">Create your first task</Link></p>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <h4 className="text-primary">{tasks.length}</h4>
                      <p className="text-muted mb-0">Total Tasks</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-success">{tasks.filter(t => t.status === 'Completed').length}</h4>
                      <p className="text-muted mb-0">Completed</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-info">{tasks.filter(t => t.status === 'InProgress').length}</h4>
                      <p className="text-muted mb-0">In Progress</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-secondary">{tasks.filter(t => t.status === 'Pending').length}</h4>
                      <p className="text-muted mb-0">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="row">
            {tasks.map((task) => (
              <div key={task.taskId} className="col-md-6 col-lg-4 mb-4">
                <div className={`card task-card card-hover priority-${task.priority.toLowerCase()}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title task-title mb-0">{task.title}</h6>
                      <span className={`badge ${getPriorityBadgeClass(task.priority)} ms-2`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p className="card-text task-description">
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description
                      }
                    </p>
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="fas fa-tag me-1"></i>
                        {task.category}
                      </small>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        {task.userName}
                      </small>
                    </div>
                    
                    {task.dueDate && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          Due: {formatDate(task.dueDate)}
                        </small>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <select
                        className={`form-select form-select-sm ${getStatusBadgeClass(task.status)}`}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                        style={{ maxWidth: '120px' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <small className="text-muted">{formatDate(task.createdAt)}</small>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <Link 
                        to={`/tasks/${task.taskId}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fas fa-eye me-1"></i>
                        View
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteTask(task.taskId, task.title)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TasksPage;