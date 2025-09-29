import React, { useState, useEffect } from 'react';
import { userAPI, taskAPI } from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('1'); // Default to first user
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserProfile();
    }
  }, [selectedUserId]);

  const fetchAvailableUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setAvailableUsers(response.data);
      if (response.data.length > 0) {
        setSelectedUserId(response.data[0].userId.toString());
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const [userResponse, tasksResponse] = await Promise.all([
        userAPI.getById(selectedUserId),
        taskAPI.getByUser(selectedUserId)
      ]);

      setUser(userResponse.data);
      setUserTasks(tasksResponse.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning';
      case 'user': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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

  const calculateTaskStats = () => {
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.status === 'Completed').length;
    const inProgress = userTasks.filter(task => task.status === 'InProgress').length;
    const pending = userTasks.filter(task => task.status === 'Pending').length;
    const overdue = userTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed'
    ).length;

    return { total, completed, inProgress, pending, overdue };
  };

  const getTasksByPriority = (priority) => {
    return userTasks.filter(task => task.priority === priority);
  };

  const stats = calculateTaskStats();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="fas fa-user me-2"></i>
            User Profile
          </h2>
          <p className="text-muted">View user information and task statistics</p>
        </div>
        <div className="col-md-4">
          <label htmlFor="userSelect" className="form-label">Select User:</label>
          <select
            id="userSelect"
            className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {availableUsers.map(u => (
              <option key={u.userId} value={u.userId}>
                {u.firstName} {u.lastName} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {user && (
        <>
          {/* User Information Card */}
          <div className="row mb-4">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <div 
                      className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px' }}
                    >
                      <i className="fas fa-user fa-2x text-white"></i>
                    </div>
                  </div>
                  
                  <h4 className="mb-1">{user.firstName} {user.lastName}</h4>
                  <span className={`badge ${getRoleBadgeClass(user.role)} mb-3`}>
                    {user.role}
                  </span>
                  
                  <div className="row text-center">
                    <div className="col-12 mb-2">
                      <i className="fas fa-envelope text-muted me-2"></i>
                      <small>{user.email}</small>
                    </div>
                    <div className="col-12">
                      <i className="fas fa-calendar text-muted me-2"></i>
                      <small>Member since {formatDate(user.createdAt)}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-chart-bar me-2"></i>
                    Task Statistics
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-6 col-lg-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-tasks fa-2x text-primary mb-2"></i>
                        <h4 className="mb-1">{stats.total}</h4>
                        <small className="text-muted">Total Tasks</small>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                        <h4 className="mb-1">{stats.completed}</h4>
                        <small className="text-muted">Completed</small>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-play-circle fa-2x text-info mb-2"></i>
                        <h4 className="mb-1">{stats.inProgress}</h4>
                        <small className="text-muted">In Progress</small>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-clock fa-2x text-secondary mb-2"></i>
                        <h4 className="mb-1">{stats.pending}</h4>
                        <small className="text-muted">Pending</small>
                      </div>
                    </div>
                  </div>
                  
                  {stats.overdue > 0 && (
                    <div className="alert alert-warning mt-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      You have <strong>{stats.overdue}</strong> overdue task{stats.overdue !== 1 ? 's' : ''}!
                    </div>
                  )}

                  {stats.total > 0 && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Completion Rate</span>
                        <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                      </div>
                      <div className="progress">
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="row mb-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-exclamation me-2"></i>
                    Tasks by Priority
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
                        <h4 className="mb-1">{getTasksByPriority('High').length}</h4>
                        <small className="text-muted">High Priority</small>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-exclamation fa-2x text-warning mb-2"></i>
                        <h4 className="mb-1">{getTasksByPriority('Medium').length}</h4>
                        <small className="text-muted">Medium Priority</small>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <i className="fas fa-info fa-2x text-success mb-2"></i>
                        <h4 className="mb-1">{getTasksByPriority('Low').length}</h4>
                        <small className="text-muted">Low Priority</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-clock me-2"></i>
                    Recent Tasks
                  </h5>
                </div>
                <div className="card-body">
                  {userTasks.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <p>No tasks assigned to this user</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userTasks
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 10)
                            .map((task) => (
                            <tr key={task.taskId}>
                              <td>
                                <strong>{task.title}</strong>
                                {task.description && (
                                  <div>
                                    <small className="text-muted">
                                      {task.description.length > 50 
                                        ? `${task.description.substring(0, 50)}...` 
                                        : task.description
                                      }
                                    </small>
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{task.category}</span>
                              </td>
                              <td>
                                {task.dueDate ? (
                                  <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-danger' : ''}>
                                    {formatDate(task.dueDate)}
                                    {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                                      <i className="fas fa-exclamation-triangle text-danger ms-1"></i>
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-muted">N/A</span>
                                )}
                              </td>
                              <td className="text-muted">
                                {formatDate(task.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;