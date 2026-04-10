import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import { updateUser } from '../../services/P_userService';
import { validateEditProfileField, validateEditProfileForm } from '../../validation/Shared_editProfileValidation';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import './Shared_EditProfilePage.css';

const Shared_EditProfilePage = () => {
  const { user, fetchCurrentUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || user.name || '',
        phone: user.phone || '',
        department: user.department || ''
      });
    }
  }, [user]);

  if (!user) return <div className="shared-profile-loading">Loading configuration...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const err = validateEditProfileField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateEditProfileForm(formData);
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // User properties mapping
      const updatePayload = {
        username: formData.name, // Backend expects 'username'
        phone: formData.phone,
        department: formData.department,
        // Preserve immutable or separately managed fields
        email: user.email,
        role: user.role,
        active: true
      };

      const updatedUser = await updateUser(user.id, updatePayload);
      
      // Update the global context and local storage with the new user data
      setUser(updatedUser);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shared-edit-profile-page">
      <Shared_PageHeader 
        title="Edit Profile" 
        subtitle="Manage your personal campus information."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Profile', path: '/profile' },
          { label: 'Edit Profile' }
        ]}
      />

      <div className="edit-profile-container">
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          
          <div className="ep-form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={fieldErrors.name ? 'input-error' : ''}
              required 
            />
            {fieldErrors.name && <span className="field-error-msg" style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{fieldErrors.name}</span>}
          </div>

          <div className="ep-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="077XXXXXXX"
              className={fieldErrors.phone ? 'input-error' : ''}
              required 
            />
            {fieldErrors.phone && <span className="field-error-msg" style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{fieldErrors.phone}</span>}
          </div>

          <div className="ep-form-group">
            <label htmlFor="department">Department / Faculty</label>
            <input 
              type="text" 
              id="department" 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className={fieldErrors.department ? 'input-error' : ''}
              required 
            />
            {fieldErrors.department && <span className="field-error-msg" style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>{fieldErrors.department}</span>}
          </div>

          <div className="ep-form-readonly">
            <p><strong>Note:</strong> Email addresses and System Roles cannot be changed manually. Please contact Campus Administration if these need to be updated.</p>
          </div>

          {error && <div className="ep-alert ep-alert-error">{error}</div>}
          {success && <div className="ep-alert ep-alert-success">Profile updated successfully! Redirecting...</div>}

          <div className="ep-actions">
            <button 
              type="button" 
              className="ep-cancel-btn" 
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="ep-save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Shared_EditProfilePage;
