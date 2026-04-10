import React from 'react';
import { useNavigate } from 'react-router-dom';
import C_TicketCard from '../../components/C_ticketing/C_TicketCard';
import './C_TicketHomePage.css';

// Mock summary stats and recent tickets for demo
const mockStats = {
  open: 4,
  inProgress: 2,
  resolved: 11,
  urgent: 1
};

const mockRecentTickets = [
  {
    id: 'TK-1001',
    resourceName: 'Auditorium A',
    category: 'ELECTRICAL',
    description: 'Projector stopped working mid-lecture. Needs immediate inspection.',
    priority: 'HIGH',
    status: 'OPEN',
    createdDate: '2026-05-14',
    assignedTechnician: null
  },
  {
    id: 'TK-1002',
    resourceName: 'Main IT Lab',
    category: 'AV_EQUIPMENT',
    description: 'Three workstations failing to boot. Students unable to complete work.',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    createdDate: '2026-05-13',
    assignedTechnician: 'D. Perera'
  },
  {
    id: 'TK-1003',
    resourceName: 'Meeting Room Alpha',
    category: 'HVAC',
    description: 'Air conditioning unit making loud noise and not cooling effectively.',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdDate: '2026-05-12',
    assignedTechnician: null
  }
];

const C_TicketHomePage = ({ userRole = 'student' }) => {
  const navigate = useNavigate();

  const statCards = [
    { label: 'Open Tickets', value: mockStats.open, icon: '📋', colorClass: 'c-thp-card-blue', path: '/tickets/my?status=OPEN' },
    { label: 'In Progress', value: mockStats.inProgress, icon: '🔧', colorClass: 'c-thp-card-amber', path: '/tickets/my?status=IN_PROGRESS' },
    { label: 'Resolved', value: mockStats.resolved, icon: '✅', colorClass: 'c-thp-card-green', path: '/tickets/my?status=RESOLVED' },
    { label: 'Urgent', value: mockStats.urgent, icon: '🚨', colorClass: 'c-thp-card-red', path: '/tickets/my?status=OPEN&priority=URGENT' }
  ];

  return (
    <div className="c-ticket-home-page">
      {/* Hero Banner */}
      <div className="c-thp-hero">
        <div className="c-thp-hero-text">
          <h1>🛠️ Maintenance & Support</h1>
          <p>Report facility issues, track repairs, and follow up on maintenance requests across campus.</p>
        </div>
        <button className="c-thp-hero-cta" onClick={() => navigate('/tickets/new')}>
          + Report an Issue
        </button>
      </div>

      {/* Stats Cards */}
      <div className="c-thp-stats-grid">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`c-thp-stat-card ${card.colorClass}`}
            onClick={() => navigate(card.path)}
          >
            <span className="c-thp-stat-icon">{card.icon}</span>
            <div className="c-thp-stat-text">
              <span className="c-thp-stat-value">{card.value}</span>
              <span className="c-thp-stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="c-thp-nav-section">
        <h2>Quick Actions</h2>
        <div className="c-thp-nav-grid">
          <button className="c-thp-nav-btn" onClick={() => navigate('/tickets/new')}>
            <span>📝</span> Create Ticket
          </button>
          <button className="c-thp-nav-btn" onClick={() => navigate('/tickets/my')}>
            <span>📂</span> My Tickets
          </button>
          {(userRole === 'admin' || userRole === 'technician') && (
            <button className="c-thp-nav-btn c-thp-nav-btn-tech" onClick={() => navigate('/tickets/queue')}>
              <span>🔧</span> Technician Queue
            </button>
          )}
          {userRole === 'admin' && (
            <button className="c-thp-nav-btn c-thp-nav-btn-admin" onClick={() => navigate('/tickets/admin')}>
              <span>🛡️</span> Admin Manage
            </button>
          )}
        </div>
      </div>

      {/* Recent Tickets Preview */}
      <div className="c-thp-recent-section">
        <div className="c-thp-section-header">
          <h2>Recent Tickets</h2>
          <button className="c-thp-view-all" onClick={() => navigate('/tickets/my')}>
            View All →
          </button>
        </div>
        <div className="c-thp-ticket-grid">
          {mockRecentTickets.map(ticket => (
            <C_TicketCard
              key={ticket.id}
              ticket={ticket}
              userRole={userRole}
              onView={(t) => navigate(`/tickets/${t.id}`)}
              onComment={(t) => navigate(`/tickets/${t.id}#comments`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default C_TicketHomePage;
