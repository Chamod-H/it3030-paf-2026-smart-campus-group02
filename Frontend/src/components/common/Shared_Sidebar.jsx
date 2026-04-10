import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import { 
  FiBarChart2, 
  FiUsers, 
  FiUserPlus, 
  FiTool, 
  FiBell, 
  FiBox, 
  FiClipboard, 
  FiTrendingUp,
  FiHome,
  FiTag,
  FiCalendar,
  FiMonitor,
  FiMap,
  FiUser
} from 'react-icons/fi';
import './Shared_Sidebar.css';

/**
 * Global Side Navigation Bar
 * Provides module-based grouping, collapsible behavior, 
 * and role-based visibility control.
 */
const Shared_Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Hide sidebar on pure authentication sequence pages to keep them distraction-free
  const hideOnRoutes = ['/login', '/auth/callback', '/unauthorized', '/profile/setup'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const userRole = user?.role?.toLowerCase() || 'student';

  // We explicitly normalize "staff" to handle spacing differences gracefully from the UI
  const normalizedRole = userRole.replace(' ', '_');

  const menuSections = [
    // ── ADMIN SIDEBAR MODULES ──
    {
      title: 'Admin: Global Overview',
      roles: ['admin'],
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
        { label: 'Student List', path: '/admin/users', icon: <FiUsers /> },
        { label: 'Lectures List', path: '/admin/users?filter=lecturer', icon: <FiUserPlus /> },
        { label: 'Staff List', path: '/admin/users?filter=staff', icon: <FiTool /> },
        { label: 'Broadcast Alerts', path: '/admin/notifications', icon: <FiBell /> }
      ]
    },
    {
      title: 'Admin: Resource Control',
      roles: ['admin'],
      items: [
        { label: 'Manage Facilities', path: '/admin/facilities', icon: <FiBox /> },
        { label: 'Booking Oversight Manage', path: '/admin/bookings', icon: <FiClipboard /> },
        { label: 'Ticket Analytics', path: '/admin/tickets', icon: <FiTrendingUp /> }
      ]
    },

    // ── LECTURER SIDEBAR MODULES ──
    {
      title: 'Lecturer Services',
      roles: ['lecturer'],
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
        { label: 'My Bookings', path: '/bookings/my', icon: <FiCalendar /> },
        { label: 'Facility Booking', path: '/bookings/new', icon: <FiMap /> },
        { label: 'Equipment Booking', path: '/bookings/equipment', icon: <FiMonitor /> },
        { label: 'My Tickets Track', path: '/tickets/my', icon: <FiTag /> }
      ]
    },

    // ── STAFF MEMBER SIDEBAR MODULES ──
    {
      title: 'Staff Operations Engine',
      roles: ['staff_member', 'staff'],
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
        { label: 'Maintenance Queue', path: '/tickets/queue', icon: <FiTool /> }
      ]
    },

    // ── STUDENT SIDEBAR MODULES ──
    {
      title: 'Student Portal',
      roles: ['student'],
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
        { label: 'My Tickets Track', path: '/tickets/my', icon: <FiTag /> }
      ]
    },

    // ── UNIVERSAL LINKS ──
    {
      title: 'My Settings',
      roles: ['admin', 'lecturer', 'student', 'staff_member', 'staff'],
      items: [
        { label: 'My Profile', path: '/profile', icon: <FiUser /> },
        
      ]
    }
  ];

  return (
    <aside className={`shared-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="shared-sidebar-header">
        <button 
          className="shared-sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle Sidebar"
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <div className="shared-sidebar-scroll">
        {menuSections.map((section, idx) => {
          // Check if section is allowed for user role
          if (!section.roles.includes(normalizedRole)) return null;

          // Filter items based on specific item roles
          const visibleItems = section.items.filter(item => 
            !item.roles || item.roles.includes(normalizedRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="shared-sidebar-section">
              {!collapsed && <h4 className="shared-sidebar-title">{section.title}</h4>}
              
              <ul className="shared-sidebar-list">
                {visibleItems.map(item => (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => `shared-sidebar-link ${isActive ? 'active' : ''}`}
                      title={collapsed ? item.label : ''}
                    >
                      <span className="shared-sidebar-icon">{item.icon}</span>
                      {!collapsed && <span className="shared-sidebar-label">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Shared_Sidebar;
