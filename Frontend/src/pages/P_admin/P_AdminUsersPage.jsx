import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/P_userService';
import { validateAdminUserForm } from '../../validation/P_profileValidation';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './P_AdminUsersPage.css';

const P_AdminUsersPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterRole = queryParams.get('filter') || 'student'; // Defaults to student if empty

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    department: '',
    role: filterRole.toUpperCase() === 'STAFF' ? 'STAFF_MEMBER' : filterRole.toUpperCase(),
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ role: filterRole });
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data || err.message));
    }
  };

  const handleOpenModal = (user = null) => {
    setValidationErrors({});
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        role: user.role || (filterRole.toUpperCase() === 'STAFF' ? 'STAFF_MEMBER' : filterRole.toUpperCase()),
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        phone: '',
        department: '',
        role: filterRole.toUpperCase() === 'STAFF' ? 'STAFF_MEMBER' : filterRole.toUpperCase(),
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Real-time validation for the specific field
      const liveErrors = validateAdminUserForm(newData, !!editingUser);
      
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        // If there's an error for this field, show it
        if (liveErrors[name]) {
          newErrors[name] = liveErrors[name];
        } else {
          // If the error was fixed, remove it
          delete newErrors[name];
        }
        return newErrors;
      });
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateAdminUserForm(formData, !!editingUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      const respData = err.response?.data;
      const printMsg = typeof respData === 'object' ? (respData.message || JSON.stringify(respData)) : (respData || err.message);
      alert('Error saving user: ' + printMsg);
    }
  };

  const getRoleDisplayName = (roleStr) => {
    switch (roleStr.toLowerCase()) {
      case 'lecturer': return 'Lecturers';
      case 'staff': return 'Staff Members';
      case 'student': return 'Students';
      default: return roleStr;
    }
  };

  return (
    <div className="admin-page-container">
      <Shared_PageHeader 
        title={`Directory: ${getRoleDisplayName(filterRole)}`}
        subtitle={`Manage active accounts for ${filterRole}s in the system.`}
      />
      
      <div className="content-panel">
        <div className="panel-header-actions">
          <h2>Accounts List</h2>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Add New {filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No records found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.department || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <button className="btn-icon edit" onClick={() => handleOpenModal(user)} aria-label="Edit"><FiEdit2 /></button>
                      <button className="btn-icon delete" onClick={() => handleDelete(user.id)} aria-label="Delete"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="user-form" noValidate>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" name="username" value={formData.username} onChange={handleInputChange} />
                {validationErrors.username && <span className="error-text" style={{color: 'red', fontSize: '13px'}}>{validationErrors.username}</span>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                {validationErrors.email && <span className="error-text" style={{color: 'red', fontSize: '13px'}}>{validationErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                {validationErrors.phone && <span className="error-text" style={{color: 'red', fontSize: '13px'}}>{validationErrors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Department / Faculty</label>
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
                {validationErrors.department && <span className="error-text" style={{color: 'red', fontSize: '13px'}}>{validationErrors.department}</span>}
              </div>
              <div className="form-group">
                <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required={!editingUser}
                />
                {validationErrors.password && <span className="error-text" style={{color: 'red', fontSize: '13px'}}>{validationErrors.password}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default P_AdminUsersPage;
