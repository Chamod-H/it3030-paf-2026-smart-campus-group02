import React, { useState, useMemo } from 'react';
import P_RoleBadge from '../../components/P_auth_notify/P_RoleBadge';
import './P_AdminRoleManagementPage.css';

/**
 * Administrative dashboard for managing user roles and system access.
 */
const P_AdminRoleManagementPage = () => {
  // Mock data for demonstration
  const [users, setUsers] = useState([
    { id: 1, name: 'Dana Perera', email: 'dana.p@campus.edu', role: 'admin', status: 'active' },
    { id: 2, name: 'Kushan Silva', email: 'kushan.s@campus.edu', role: 'student', status: 'active' },
    { id: 3, name: 'Amara Weerasinghe', email: 'amara.w@campus.edu', role: 'lecturer', status: 'active' },
    { id: 4, name: 'Lakmal Gunawardena', email: 'lakmal.g@campus.edu', role: 'staff_member', status: 'suspended' },
    { id: 5, name: 'Nirosha Fernando', email: 'niro.f@campus.edu', role: 'student', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isConfirming, setIsConfirming] = useState(null); // { userId, newRole }

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleRoleChangeRequest = (userId, newRole) => {
    setIsConfirming({ userId, newRole });
  };

  const confirmRoleChange = () => {
    const { userId, newRole } = isConfirming;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setIsConfirming(null);
    // In real app: toast.success('Role updated successfully');
  };

  return (
    <div className="p-admin-roles-page">
      <div className="p-admin-container">
        <header className="p-admin-header">
          <div className="p-admin-title">
            <h1>Member Management</h1>
            <p>Admin Control Panel • Role Hierarchy & Authorization</p>
          </div>
        </header>

        {/* Filters Bar */}
        <section className="p-admin-filters">
          <div className="p-search-box">
            <span className="p-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="p-filter-actions">
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-role-filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="lecturer">Lecturers</option>
              <option value="staff_member">Staff Members</option>
              <option value="student">Students</option>
            </select>
          </div>
        </section>

        {/* Users Table */}
        <main className="p-admin-table-wrapper">
          <table className="p-admin-table">
            <thead>
              <tr>
                <th>Member Info</th>
                <th>Access Role</th>
                <th>Cloud Status</th>
                <th className="p-text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="p-user-info-cell">
                        <div className="p-user-avatar-mini">
                          {user.name[0]}
                        </div>
                        <div className="p-user-details">
                          <span className="p-user-name">{user.name}</span>
                          <span className="p-user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <P_RoleBadge role={user.role} />
                    </td>
                    <td>
                      <span className={`p-status-indicator ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-text-right">
                      <div className="p-action-buttons">
                        <select 
                          className="p-role-quick-change"
                          value={user.role}
                          onChange={(e) => handleRoleChangeRequest(user.id, e.target.value)}
                        >
                          <option value="student">Set to Student</option>
                          <option value="lecturer">Set to Lecturer</option>
                          <option value="staff_member">Set to Staff Member</option>
                          <option value="admin">Set to Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-table-empty">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="p-modal-overlay">
          <div className="p-confirm-modal">
            <h3>Confirm Authorization Change</h3>
            <p>
              Are you sure you want to change the role of <strong>
              {users.find(u => u.id === isConfirming.userId)?.name}
              </strong> to <span className="p-modal-role-highlight">{isConfirming.newRole}</span>?
            </p>
            <div className="p-modal-warning">
              This will immediately update their permissions across all campus modules.
            </div>
            <div className="p-modal-actions">
              <button 
                className="p-modal-btn p-btn-cancel" 
                onClick={() => setIsConfirming(null)}
              >
                Cancel
              </button>
              <button 
                className="p-modal-btn p-btn-confirm" 
                onClick={confirmRoleChange}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default P_AdminRoleManagementPage;
