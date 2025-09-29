import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getById(id);
      setTask(response.data);
    } catch (err) {
      console.error('Error fetching task:', err);
      if (err.response?.status === 404) {
        setError('Task not found');
      } else {
        setError('Failed to load task details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updating) return;

    try {
      setUpdating(true);
      await taskAPI.updateStatus(id, newStatus);
      setTask(prev => ({
        ...prev,
        status: newStatus,
        completedAt: newStatus === 'Completed' ? new Date().toISOString() : null
      }));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      try {
        await taskAPI.delete(id);
        navigate('/tasks');
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'fas fa-check-circle';
      case 'inprogress': return 'fas fa-play-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-question-circle';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'fas fa-exclamation-triangle';
      case 'medium': return 'fas fa-exclamation';
      case 'low': return 'fas fa-info';
      default: return 'fas fa-question';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading task details...</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container">
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/tasks" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/tasks" className="text-decoration-none">Tasks</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Task #{task?.taskId}
              </li>
            </ol>
          </nav>
          
          <h2 className="mb-0">
            <i className="fas fa-tasks me-2"></i>
            {task?.title}
          </h2>
        </div>
        <div className="col-md-4 text-end">
          <div className="btn-group" role="group">
            <Link to="/tasks" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Tasks
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
            >
              <i className="fas fa-trash me-2"></i>
              Delete Task
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          {/* Main Task Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Task Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Title:</strong>
                </div>
                <div className="col-sm-9">
                  {task?.title}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Description:</strong>
                </div>
                <div className="col-sm-9">
                  {task?.description ? (
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {task.description}
                    </p>
                  ) : (
                    <span className="text-muted">No description provided</span>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Category:</strong>
                </div>
                <div className="col-sm-9">
                  <span className="badge bg-secondary">
                    <i className="fas fa-tag me-1"></i>
                    {task?.category}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Priority:</strong>
                </div>
                <div className="col-sm-9">
                  <span className={`badge ${getPriorityBadgeClass(task?.priority)}`}>
                    <i className={`${getPriorityIcon(task?.priority)} me-1`}></i>
                    {task?.priority} Priority
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Assigned to:</strong>
                </div>
                <div className="col-sm-9">
                  <i className="fas fa-user me-1"></i>
                  {task?.userName}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Due Date:</strong>
                </div>
                <div className="col-sm-9">
                  {task?.dueDate ? (
                    <span className={new Date(task.dueDate) < new Date() ? 'text-danger' : 'text-success'}>
                      <i className="fas fa-calendar me-1"></i>
                      {formatDateShort(task.dueDate)}
                      {new Date(task.dueDate) < new Date() && (
                        <span className="ms-2 badge bg-danger">Overdue</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted">No due date set</span>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3">
                  <strong>Created:</strong>
                </div>
                <div className="col-sm-9">
                  <i className="fas fa-clock me-1"></i>
                  {formatDate(task?.createdAt)}
                </div>
              </div>

              {task?.completedAt && (
                <div className="row mt-3">
                  <div className="col-sm-3">
                    <strong>Completed:</strong>
                  </div>
                  <div className="col-sm-9">
                    <i className="fas fa-check me-1 text-success"></i>
                    {formatDate(task.completedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Status Management */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                Status Management
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Current Status:</label>
                <div>
                  <span className={`badge ${getStatusBadgeClass(task?.status)} fs-6`}>
                    <i className={`${getStatusIcon(task?.status)} me-1`}></i>
                    {task?.status}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Update Status:</label>
                <div className="d-grid gap-2">
                  <button
                    className={`btn ${task?.status === 'Pending' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => handleStatusChange('Pending')}
                    disabled={updating || task?.status === 'Pending'}
                  >
                    <i className="fas fa-clock me-2"></i>
                    {updating ? 'Updating...' : 'Mark as Pending'}
                  </button>
                  
                  <button
                    className={`btn ${task?.status === 'InProgress' ? 'btn-info' : 'btn-outline-info'}`}
                    onClick={() => handleStatusChange('InProgress')}
                    disabled={updating || task?.status === 'InProgress'}
                  >
                    <i className="fas fa-play-circle me-2"></i>
                    {updating ? 'Updating...' : 'Mark as In Progress'}
                  </button>
                  
                  <button
                    className={`btn ${task?.status === 'Completed' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleStatusChange('Completed')}
                    disabled={updating || task?.status === 'Completed'}
                  >
                    <i className="fas fa-check-circle me-2"></i>
                    {updating ? 'Updating...' : 'Mark as Completed'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Task Statistics */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Task Statistics
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-12 mb-3">
                  <h6 className="text-muted">Time Information</h6>
                </div>
                <div className="col-12 mb-2">
                  <small className="text-muted d-block">Days Since Created</small>
                  <strong className="text-primary">
                    {Math.ceil((new Date() - new Date(task?.createdAt)) / (1000 * 60 * 60 * 24))} day(s)
                  </strong>
                </div>
                {task?.dueDate && (
                  <div className="col-12 mb-2">
                    <small className="text-muted d-block">Days Until Due</small>
                    <strong className={new Date(task.dueDate) < new Date() ? 'text-danger' : 'text-success'}>
                      {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} day(s)
                    </strong>
                  </div>
                )}
                {task?.completedAt && (
                  <div className="col-12 mb-2">
                    <small className="text-muted d-block">Completion Time</small>
                    <strong className="text-success">
                      {Math.ceil((new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24))} day(s)
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;