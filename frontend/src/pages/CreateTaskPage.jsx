import React, { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'General',
    userId: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
      
      // Auto-select first user if available
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          userId: response.data[0].userId.toString()
        }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.priority.trim()) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.length > 100) {
      newErrors.category = 'Category must be less than 100 characters';
    }

    if (!formData.userId) {
      newErrors.userId = 'Please select a user';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const taskData = {
        ...formData,
        userId: parseInt(formData.userId),
        dueDate: formData.dueDate || null
      };

      await taskAPI.create(taskData);
      setSuccess('Task created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'General',
        userId: users.length > 0 ? users[0].userId.toString() : '',
        dueDate: ''
      });

      // Redirect to tasks page after a short delay
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);

    } catch (err) {
      console.error('Error creating task:', err);
      if (err.response?.status === 400) {
        setErrors({ submit: err.response.data || 'Invalid data provided' });
      } else {
        setErrors({ submit: 'Failed to create task. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const commonCategories = [
    'General',
    'Development',
    'Design',
    'Testing',
    'Documentation',
    'Meeting',
    'Research',
    'Bug Fix',
    'Feature',
    'Maintenance'
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Create New Task
              </h3>
            </div>
            <div className="card-body">
              {success && (
                <div className="success">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {errors.submit && (
                <div className="error">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Task Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="Enter task title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title}
                    </div>
                  )}
                  <div className="form-text">
                    {formData.title.length}/200 characters
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    placeholder="Provide a detailed description of the task"
                  />
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}
                  <div className="form-text">
                    {formData.description.length}/1000 characters (Optional)
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.priority && (
                      <div className="invalid-feedback">
                        {errors.priority}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {commonCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="invalid-feedback">
                        {errors.category}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="userId" className="form-label">
                      Assign to User <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.userId ? 'is-invalid' : ''}`}
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.firstName} {user.lastName} ({user.role})
                        </option>
                      ))}
                    </select>
                    {errors.userId && (
                      <div className="invalid-feedback">
                        {errors.userId}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="dueDate" className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={today}
                    />
                    {errors.dueDate && (
                      <div className="invalid-feedback">
                        {errors.dueDate}
                      </div>
                    )}
                    <div className="form-text">
                      Optional - leave blank if no specific due date
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate('/tasks')}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || users.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Create Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Priority Guide */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Priority Guidelines
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <h6 className="text-success">
                    <i className="fas fa-circle me-1"></i>
                    Low Priority
                  </h6>
                  <p className="text-muted small">
                    Nice to have features, minor improvements, or tasks that can wait
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-warning">
                    <i className="fas fa-circle me-1"></i>
                    Medium Priority
                  </h6>
                  <p className="text-muted small">
                    Important tasks that should be completed in reasonable time
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-danger">
                    <i className="fas fa-circle me-1"></i>
                    High Priority
                  </h6>
                  <p className="text-muted small">
                    Critical tasks, urgent fixes, or time-sensitive deliverables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;