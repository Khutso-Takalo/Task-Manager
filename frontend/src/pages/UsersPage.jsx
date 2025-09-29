import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (selectedRole === 'all') {
        response = await userAPI.getAll();
      } else {
        response = await userAPI.getByRole(selectedRole);
      }

      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await userAPI.delete(userId);
        setUsers(users.filter(user => user.userId !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning';
      case 'user': return 'bg-primary';
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
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>
            <i className="fas fa-users me-2"></i>
            User Management
          </h2>
          <p className="text-muted">Manage user accounts and permissions</p>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/users/create" className="btn btn-primary">
            <i className="fas fa-user-plus me-2"></i>
            Add New User
          </Link>
        </div>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Filter by Role */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="roleFilter" className="form-label">Filter by Role:</label>
          <select
            id="roleFilter"
            className="form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="card">
          <div className="card-body text-center text-muted py-5">
            <i className="fas fa-users fa-3x mb-3"></i>
            <p>No users found. <Link to="/users/create">Add your first user</Link></p>
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
                      <h4 className="text-primary">{users.length}</h4>
                      <p className="text-muted mb-0">Total Users</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-danger">{users.filter(u => u.role === 'Admin').length}</h4>
                      <p className="text-muted mb-0">Admins</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-warning">{users.filter(u => u.role === 'Manager').length}</h4>
                      <p className="text-muted mb-0">Managers</p>
                    </div>
                    <div className="col-md-3">
                      <h4 className="text-info">{users.filter(u => u.role === 'User').length}</h4>
                      <p className="text-muted mb-0">Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Users List ({users.length} {selectedRole !== 'all' && `${selectedRole} `}user{users.length !== 1 ? 's' : ''})
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Tasks</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td>
                          <span className="badge bg-light text-dark">#{user.userId}</span>
                        </td>
                        <td>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                          </div>
                        </td>
                        <td>
                          <i className="fas fa-envelope text-muted me-1"></i>
                          {user.email}
                        </td>
                        <td>
                          <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {user.taskCount} task{user.taskCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="text-muted">
                          <i className="fas fa-calendar text-muted me-1"></i>
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <Link
                              to={`/users/${user.userId}/edit`}
                              className="btn btn-outline-primary"
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteUser(user.userId, `${user.firstName} ${user.lastName}`)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;