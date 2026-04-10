import React from 'react';
import './C_TicketCard.css';

/**
 * Universal Card layout intrinsically designed for displaying single incident tickets globally across all Module C views.
 * Reacts structurally to userRole map ('student', 'admin', 'technician') enabling/disabling security bindings instantly.
 */
const C_TicketCard = ({
  ticket,
  userRole = 'student',
  onView,
  onEdit,
  onComment,
  onUpdateStatus
}) => {
  if (!ticket) return null;

  // Derive contextual configurations natively mapping visual boundary triggers
  const isHighPriority = ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL';
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'c-tc-status-open';
      case 'IN_PROGRESS': return 'c-tc-status-progress';
      case 'RESOLVED': return 'c-tc-status-resolved';
      case 'CLOSED': return 'c-tc-status-closed';
      default: return 'c-tc-status-default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'LOW': return 'c-tc-pri-low';
      case 'MEDIUM': return 'c-tc-pri-med';
      case 'HIGH': return 'c-tc-pri-high';
      case 'CRITICAL': return 'c-tc-pri-crit';
      default: return 'c-tc-pri-default';
    }
  };

  // Truncate massively long user descriptions gracefully without destroying the CSS flexbox map
  const truncateDesc = (text, max = 80) => {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  };

  // Strict local Security Component mapping constraints directly tied to the React props globally
  const canEdit = userRole === 'admin' || (userRole === 'student' && ticket.status === 'OPEN');
  const canUpdateStatus = userRole === 'admin' || userRole === 'technician';

  return (
    <div className={`c-ticket-card ${isHighPriority ? 'c-tc-alert-border' : ''}`}>
      <div className="c-tc-header">
        <span className="c-tc-id">{ticket.id}</span>
        <div className="c-tc-badges">
          <span className={`c-tc-priority ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`c-tc-status ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="c-tc-content">
        <h3 className="c-tc-resource">{ticket.resourceName || ticket.location}</h3>
        <span className="c-tc-category">{ticket.category}</span>
        
        <p className="c-tc-desc">{truncateDesc(ticket.description)}</p>

        {/* Dense structural Meta Grid */}
        <div className="c-tc-meta-grid">
          <div className="c-tc-meta-item">
            <span className="c-tc-meta-lbl">System Created:</span>
            <span className="c-tc-meta-val">{ticket.createdDate}</span>
          </div>
          <div className="c-tc-meta-item">
            <span className="c-tc-meta-lbl">Assigned To:</span>
            <span className="c-tc-meta-val">{ticket.assignedTechnician || 'Unassigned Queue'}</span>
          </div>
        </div>
      </div>

      <div className="c-tc-footer">
        <div className="c-tc-action-main">
          <button className="c-tc-btn-view" onClick={() => onView && onView(ticket)}>
            View Scope
          </button>
          <button className="c-tc-btn-comment" onClick={() => onComment && onComment(ticket)}>
            💬 Comment
          </button>
        </div>
        
        <div className="c-tc-action-secondary">
          {/* System conditionally injects these specifically constrained DOM structures dynamically based strictly on Role array mappings */}
          {canEdit && (
            <button className="c-tc-btn-edit" onClick={() => onEdit && onEdit(ticket)}>
              Edit Thread
            </button>
          )}
          {canUpdateStatus && (
            <button className="c-tc-btn-status" onClick={() => onUpdateStatus && onUpdateStatus(ticket)}>
              Elevate Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default C_TicketCard;
