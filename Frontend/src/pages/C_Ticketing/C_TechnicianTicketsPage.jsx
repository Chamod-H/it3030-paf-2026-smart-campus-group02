import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import C_TicketStatusBadge from '../../components/C_ticketing/C_TicketStatusBadge';
import C_TicketPriorityBadge from '../../components/C_ticketing/C_TicketPriorityBadge';
import C_ResolutionNoteBox from '../../components/C_ticketing/C_ResolutionNoteBox';
import C_TicketCommentForm from '../../components/C_ticketing/C_TicketCommentForm';
import './C_TechnicianTicketsPage.css';
import { getTechnicianTickets, updateTicketStatus, resolveTicket, assignTechnician } from '../../services/C_ticketService';
import P_authService from '../../services/P_authService';
import { useAuth } from '../../contexts/P_AuthContext';

// Technicians tickets fetched directly via getTechnicianTickets

const STATUS_TRANSITIONS = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CLOSED: [],
  REJECTED: [],
};

const C_TechnicianTicketsPage = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Per-ticket expanded panels: 'resolution' | 'comment' | null
  const [expanded, setExpanded] = useState({});
  const [resolutionDraft, setResolutionDraft] = useState({});
  const [commentDraft, setCommentDraft] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  
  const { user: authUser } = useAuth();
  const activeUser = { 
    name: authUser?.name || authUser?.username || authUser?.email || 'Staff User', 
    role: authUser?.role || 'Staff Member' 
  };

  React.useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getTechnicianTickets();
      // Ensure comments array natively exists safely to prevent UI crashes if backend omits it
      setTickets(data.map(t => ({ ...t, comments: t.comments || [] })));
    } catch (err) {
      console.error("Failed to load assigned queue:", err);
      setError("Failed to synchronize active queue remotely.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tickets, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  }), [tickets]);

  const togglePanel = (ticketId, panel) => {
    setExpanded(prev => ({
      ...prev,
      [ticketId]: prev[ticketId] === panel ? null : panel
    }));
  };

  const handleStatusAdvance = async (ticketId, nextStatus) => {
    try {
      await updateTicketStatus(ticketId, { status: nextStatus });
      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, status: nextStatus } : t
      ));
    } catch (err) {
       alert("Failed to advance ticket status blocks.");
    }
  };

  const handleSaveResolution = async (ticketId, note) => {
    try {
      await resolveTicket(ticketId, { resolutionNote: note });
      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, resolutionNote: note, status: 'RESOLVED' } : t
      ));
      setExpanded(prev => ({ ...prev, [ticketId]: null }));
    } catch (err) {
      alert("Failed to persist aggressive ticket resolution note.");
    }
  };

  const handlePostComment = (ticketId) => {
    const text = commentDraft[ticketId];
    if (!text?.trim()) {
      setCommentErrors(prev => ({ ...prev, [ticketId]: 'Comment cannot be empty.' }));
      return;
    }
    setCommentErrors(prev => ({ ...prev, [ticketId]: '' }));
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, comments: [...t.comments, { id: Date.now(), text: text.trim(), author: activeUser.name, ts: new Date().toLocaleString() }] }
      : t
    ));
    setCommentDraft(prev => ({ ...prev, [ticketId]: '' }));
    setExpanded(prev => ({ ...prev, [ticketId]: null }));
  };

  return (
    <div className="c-technician-tickets-page">
      {/* Header */}
      <div className="c-ttp-header">
        <div>
          <h1>🔧 My Work Queue</h1>
          <p>Welcome, <strong>{activeUser.name}</strong> · {activeUser.role}</p>
        </div>
        <div className="c-ttp-stats">
          <div className="c-ttp-stat c-ttp-stat-blue"><span>{stats.open}</span> Open</div>
          <div className="c-ttp-stat c-ttp-stat-amber"><span>{stats.inProgress}</span> In Progress</div>
          <div className="c-ttp-stat c-ttp-stat-green"><span>{stats.resolved}</span> Resolved</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="c-ttp-filter-bar">
        <div className="c-ttp-filter-group">
          <label htmlFor="tf-status">Status</label>
          <select id="tf-status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="c-ttp-filter-group">
          <label htmlFor="tf-priority">Priority</label>
          <select id="tf-priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button className="c-ttp-reset-btn" onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>Clear</button>
        <span className="c-ttp-count">Showing <strong>{filteredTickets.length}</strong> / {tickets.length}</span>
      </div>

      {/* Ticket Cards */}
      {loading ? (
        <div className="c-ttp-empty">
           <p>Establishing secure connection to queue...</p>
        </div>
      ) : error ? (
        <div className="c-ttp-empty">
          <p>{error}</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="c-ttp-empty">
          <span>📭</span>
          <p>No tickets actively match your current routing filters.</p>
        </div>
      ) : (
        <div className="c-ttp-list">
          {filteredTickets.map(ticket => {
            const nextStatuses = STATUS_TRANSITIONS[ticket.status] || [];
            const panelOpen = expanded[ticket.id];
            const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

            return (
              <div key={ticket.id} className={`c-ttp-card ${ticket.priority === 'CRITICAL' ? 'c-ttp-card-critical' : ''}`}>
                {/* Card Header */}
                <div className="c-ttp-card-header">
                  <div className="c-ttp-card-title">
                    <span className="c-ttp-id">{ticket.id}</span>
                    <span className="c-ttp-resource">{ticket.resourceName}</span>
                    <span className="c-ttp-category">{ticket.category.replace('_', ' ')}</span>
                  </div>
                  <div className="c-ttp-badges">
                    <C_TicketPriorityBadge priority={ticket.priority} />
                    <C_TicketStatusBadge status={ticket.status} />
                  </div>
                </div>

                {/* Description */}
                <p className="c-ttp-desc">{ticket.description}</p>
                <span className="c-ttp-date">Reported: {ticket.createdDate}</span>

                {/* Action Buttons Row */}
                <div className="c-ttp-actions">
                  <button className="c-ttp-btn c-ttp-btn-view" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    🔍 View Details
                  </button>
                  {nextStatuses.map(next => (
                    <button
                      key={next}
                      className={`c-ttp-btn ${next === 'IN_PROGRESS' ? 'c-ttp-btn-progress' : 'c-ttp-btn-resolve'}`}
                      onClick={() => handleStatusAdvance(ticket.id, next)}
                    >
                      {next === 'IN_PROGRESS' ? '▶ Mark In Progress' : '✅ Mark Resolved'}
                    </button>
                  ))}
                  {!isResolved && (
                    <button
                      className={`c-ttp-btn c-ttp-btn-note ${panelOpen === 'resolution' ? 'active' : ''}`}
                      onClick={() => togglePanel(ticket.id, 'resolution')}
                    >
                      📝 Resolution Note
                    </button>
                  )}
                  <button
                    className={`c-ttp-btn c-ttp-btn-comment ${panelOpen === 'comment' ? 'active' : ''}`}
                    onClick={() => togglePanel(ticket.id, 'comment')}
                  >
                    💬 Comment {ticket.comments.length > 0 && `(${ticket.comments.length})`}
                  </button>
                </div>

                {/* Expandable: Resolution Note */}
                {panelOpen === 'resolution' && (
                  <div className="c-ttp-panel">
                    <C_ResolutionNoteBox
                      resolutionNote={resolutionDraft[ticket.id] || ''}
                      setResolutionNote={(val) => setResolutionDraft(prev => ({ ...prev, [ticket.id]: val }))}
                      onSave={(note) => handleSaveResolution(ticket.id, note)}
                      editable={true}
                    />
                  </div>
                )}

                {/* Expandable: Comment Form */}
                {panelOpen === 'comment' && (
                  <div className="c-ttp-panel">
                    {ticket.comments.length > 0 && (
                      <div className="c-ttp-comment-history">
                        {ticket.comments.map(c => (
                          <div key={c.id} className="c-ttp-comment-item">
                            <strong>{c.author}</strong> · <span>{c.ts}</span>
                            <p>{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <C_TicketCommentForm
                      value={commentDraft[ticket.id] || ''}
                      setValue={(val) => setCommentDraft(prev => ({ ...prev, [ticket.id]: val }))}
                      onSubmit={() => handlePostComment(ticket.id)}
                      mode="add"
                      errors={{ comment: commentErrors[ticket.id] }}
                    />
                  </div>
                )}

                {/* Read-only resolution note if already resolved */}
                {isResolved && ticket.resolutionNote && (
                  <div className="c-ttp-panel">
                    <C_ResolutionNoteBox
                      resolutionNote={ticket.resolutionNote}
                      editable={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default C_TechnicianTicketsPage;
