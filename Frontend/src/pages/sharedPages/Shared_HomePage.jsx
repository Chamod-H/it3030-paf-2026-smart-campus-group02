import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import './Shared_HomePage.css';

/**
 * Public Landing Page / System Welcome Page
 * Acts as the primary entry point for unauthenticated users, showcasing 
 * the core modules and routing them to login or dashboard.
 */
const Shared_HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      title: 'Facilities & Assets Catalog',
      desc: 'Browse our complete digital inventory. View building layouts, capacity details, and check real-time availability before planning your events.',
      icon: '🏢'
    },
    {
      title: 'Smart Booking System',
      desc: 'Seamlessly reserve study rooms, lecture halls, or AV equipment. Our conflict-free engine ensures your space is ready when you are.',
      icon: '📅'
    },
    {
      title: 'Maintenance Ticketing',
      desc: 'Report campus issues instantly. Track the progress of repairs and connect directly with technicians to keep the campus running smoothly.',
      icon: '🛠️'
    },
    {
      title: 'Real-Time Notifications',
      desc: 'Never miss an update. Receive instant alerts regarding booking approvals, ticket resolutions, role changes, and vital campus broadcasts.',
      icon: '🔔'
    }
  ];

  return (
    <div className="shared-home-page">
      
      {/* Hero Section */}
      <section className="shared-home-hero">
        <div className="shared-home-hero-content">
          <div className="shared-home-badge">Welcome to the Future</div>
          <h1 className="shared-home-title">Smart Campus <span>Operations Hub</span></h1>
          <p className="shared-home-subtitle">
            An integrated digital environment for modern educational institutions. 
            Streamline your daily campus interactions—from finding a quiet study room 
            to reporting a broken projector—all from a single, unified interface.
          </p>
          <button className="shared-home-cta-btn" onClick={handleGetStarted}>
            {isAuthenticated ? 'Enter Dashboard' : 'Login / Get Started'}
          </button>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="shared-home-features-section">
        <div className="shared-home-features-container">
          <h2 className="shared-home-features-title">Everything you need to navigate campus life</h2>
          <p className="shared-home-features-sub">Four powerful modules, one seamless experience.</p>
          
          <div className="shared-home-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="shared-home-card">
                <div className="shared-home-card-icon">{feature.icon}</div>
                <h3 className="shared-home-card-title">{feature.title}</h3>
                <p className="shared-home-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Shared_HomePage;
