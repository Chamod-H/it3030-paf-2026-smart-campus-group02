import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './P_UserMenu.css';

import P_RoleBadge from './P_RoleBadge';

const P_UserMenu = ({
  user,
  onLogout,
  onProfile,
  onNotifications
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(user.name);

  const handleItem = (callback, path) => {
    setOpen(false);
    if (callback) callback();
    else if (path) navigate(path);
  };

  return (
    <div className="p-user-menu" ref={menuRef}>
      {/* Trigger Button --- no changes needed here but including for context --- */}
      <button
        className={`p-um-trigger ${open ? 'p-um-trigger-open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        <span className="p-um-avatar">
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt={user.name} className="p-um-avatar-img" />
            : <span className="p-um-initials">{initials}</span>
          }
        </span>
        <span className="p-um-name">{user.name}</span>
        <span className={`p-um-chevron ${open ? 'p-um-chevron-up' : ''}`}>▾</span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="p-um-dropdown">
          {/* User Identity Header */}
          <div className="p-um-identity">
            <span className="p-um-avatar p-um-avatar-lg">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="p-um-avatar-img" />
                : <span className="p-um-initials">{initials}</span>
              }
            </span>
            <div className="p-um-identity-text">
              <span className="p-um-full-name">{user.name}</span>
              <span className="p-um-email">{user.email}</span>
              <P_RoleBadge role={user.role} size="sm" />
            </div>
          </div>

          <div className="p-um-divider" />

          {/* Navigation Items */}
          <ul className="p-um-menu-list" role="menu">
            <li role="menuitem">
              <button onClick={() => handleItem(null, '/dashboard')}>
                🏠 <span>Dashboard</span>
              </button>
            </li>
            <li role="menuitem">
              <button onClick={() => handleItem(onProfile, '/profile')}>
                👤 <span>My Profile</span>
              </button>
            </li>
            <li role="menuitem">
              <button onClick={() => handleItem(onNotifications, '/notifications')}>
                🔔 <span>Notifications</span>
              </button>
            </li>
          </ul>

          <div className="p-um-divider" />

          {/* Logout */}
          <div className="p-um-logout-wrapper">
            <button
              className="p-um-logout-btn"
              onClick={() => { setOpen(false); onLogout && onLogout(); }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default P_UserMenu;
