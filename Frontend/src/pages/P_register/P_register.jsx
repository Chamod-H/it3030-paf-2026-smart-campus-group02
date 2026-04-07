import React, { useState } from 'react';
import { validateRegister } from '../../validation/registerValidation';
import './p_register.css';

const P_register = () => {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Real-time validation
    if (touched[name]) {
      const validationErrors = validateRegister({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    const validationErrors = validateRegister(values);
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    
    // Mark all as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Registration Data:', values);
      // Logic to submit the actual registration data to the backend API goes here
    }
  };

  return (
    <div className="p_register_wrapper">
      <div className="p_register_container">
        <div className="p_register_header">
          <h2 className="p_register_title">Create an Account</h2>
          <p className="p_register_subtitle">Register for the Smart Campus Hub</p>
        </div>

        <form className="p_register_form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="p_register_input_group">
            <label className="p_register_label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`p_register_input ${errors.fullName && touched.fullName ? 'p_register_input_error' : ''}`}
              placeholder="Enter your full name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.fullName && touched.fullName && (
              <span className="p_register_error_msg">{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div className="p_register_input_group">
            <label className="p_register_label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`p_register_input ${errors.email && touched.email ? 'p_register_input_error' : ''}`}
              placeholder="e.g., it21000000@my.sliit.lk"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <span className="p_register_error_msg">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="p_register_input_group">
            <label className="p_register_label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`p_register_input ${errors.password && touched.password ? 'p_register_input_error' : ''}`}
              placeholder="Enter a strong password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && (
              <span className="p_register_error_msg">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="p_register_input_group">
            <label className="p_register_label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`p_register_input ${errors.confirmPassword && touched.confirmPassword ? 'p_register_input_error' : ''}`}
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="p_register_error_msg">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="p_register_btn_primary">
            Register
          </button>
        </form>

        <p className="p_register_login_text">
          Already have an account? <a href="/login" className="p_register_login_link">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default P_register;
