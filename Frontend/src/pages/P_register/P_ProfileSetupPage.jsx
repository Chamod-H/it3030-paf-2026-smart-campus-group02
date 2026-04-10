import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import P_profileValidation from '../../validation/P_profileValidation';
import './P_ProfileSetupPage.css';

/**
 * Student Registration / Profile Setup Page
 * STRICTLY restricted to students. Captures Username, Student Email, Mobile, Password, and Department.
 * Employs real-time validation via P_profileValidation to catch `@my.sliit.lk` violations typing.
 */
const P_ProfileSetupPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    password: '',
    department: '',
    role: 'STUDENT' // Hard-enforced per backend constraints
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Real-time Validation firing smoothly as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const validationErrors = P_profileValidation.validateProfileForm(updatedForm);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = P_profileValidation.validateProfileForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, username: formData.name };

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Registration failed.');
      }

      // Registration successful
      navigate('/login');
    } catch (err) {
      setErrors({ global: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-profile-setup-page">
      <div className="p-ps-card">

        <div className="p-ps-header">
          <h1>Student Registration</h1>
          <p>Create your new Smart Campus account to start booking and managing facilities.</p>
        </div>

        <form className="p-ps-form" onSubmit={handleSubmit}>
          <div className="p-ps-grid">

            {/* Username */}
            <div className={`p-ps-field ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chamod Perera"
              />
              {errors.name && <span className="p-ps-error-text">{errors.name}</span>}
            </div>

            {/* Email (Campus Restricted) */}
            <div className={`p-ps-field ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">Student Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="e.g. it2026xxxx@my.sliit.lk"
              />
              {errors.email && <span className="p-ps-error-text">{errors.email}</span>}
            </div>

            {/* Mobile / Phone */}
            <div className={`p-ps-field ${errors.phone ? 'error' : ''}`}>
              <label htmlFor="phone">Mobile Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +94 77 123 4567"
              />
              {errors.phone && <span className="p-ps-error-text">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className={`p-ps-field ${errors.password ? 'error' : ''}`}>
              <label htmlFor="password">Secure Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Must be at least 6 characters"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="p-ps-error-text">{errors.password}</span>}
            </div>

            {/* Department */}
            <div className={`p-ps-field ${errors.department ? 'error' : ''} full-width`}>
              <label htmlFor="department">Faculty / Department</label>
              <select 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleChange}
              >
                <option value="">Select your faculty</option>
                <option value="computing">Faculty of Computing</option>
                <option value="engineering">Faculty of Engineering</option>
                <option value="business">Faculty of Business</option>
                <option value="humanities">Faculty of Humanities & Sciences</option>
              </select>
              {errors.department && <span className="p-ps-error-text">{errors.department}</span>}
            </div>

          </div>

          {errors.global && <div className="p-ps-global-error">{errors.global}</div>}

          <div className="p-ps-footer-actions">
            <button
              type="submit"
              className={`p-ps-submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Register Account'}
            </button>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/login" className="p-ps-back-link">← Back to Login</Link>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default P_ProfileSetupPage;
