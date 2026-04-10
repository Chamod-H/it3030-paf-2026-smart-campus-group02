import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import C_TicketFilters from '../../components/C_ticketing/C_TicketFilters';
import C_TicketStatusBadge from '../../components/C_ticketing/C_TicketStatusBadge';
import C_TicketPriorityBadge from '../../components/C_ticketing/C_TicketPriorityBadge';
import C_TechnicianAssignModal from '../../components/C_ticketing/C_TechnicianAssignModal';
import './C_AdminTicketsPage.css';
import { getAllTickets, assignTechnician, updateTicketStatus } from '../../services/C_ticketService';
import P_roleService from '../../services/P_roleService';
import I_resourceService from '../../services/I_resourceService';

// Tickets dynamically pulled dynamically from getAllTickets

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const C_AdminTicketsPage = () => {
  const navigate = useNavigate();
const [tickets, setTickets] = useState([]);
const [technicians, setTechnicians] = useState([]);
const [resourceMap, setResourceMap] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const [filters, setFilters] = useState({ status: '', priority: '', category: '', resourceType: '', technicianId: '', date: '' });

// Assign modal state
const [assignModal, setAssignModal] = useState({ isOpen: false, ticket: null });
const [selectedTechnician, setSelectedTechnician] = useState('');

// Inline status edit state
const [inlineStatus, setInlineStatus] = useState({});

React.useEffect(() => {
  fetchGlobalTickets();
}, []);

const fetchGlobalTickets = async () => {
  setLoading(true);
  try {
    const [data, users, resources] = await Promise.all([
      getAllTickets(),
      P_roleService.getAllUsers(),
      I_resourceService.getAllResources().catch(() => [])
    ]);
    setTickets(data);

    const map = {};
    resources.forEach(r => { map[r.id] = r.name; });
    setResourceMap(map);

    const staffMembers = users
      .filter(u => u.role === 'STAFF_MEMBER')
      .map(u => ({ id: u.id, name: u.username || u.email || 'Unknown Staff', specialization: 'Staff Member' }));
    setTechnicians(staffMembers);
  } catch (err) {
    console.error("Critical error fetching system tickets", err);
    setError("Failed to populate master oversight queue.");
  } finally {
    setLoading(false);
  }
};

const filteredTickets = useMemo(() => {
  return tickets.filter(t => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.resourceType && !(t.location || '').toLowerCase().includes(filters.resourceType.toLowerCase())) return false;
    if (filters.date && !(t.createdAt || '').startsWith(filters.date)) return false;
    return true;
  });
}, [tickets, filters]);

const stats = useMemo(() => ({
  total: tickets.length,
  open: tickets.filter(t => t.status === 'OPEN').length,
  inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
  resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
  urgent: tickets.filter(t => t.priority === 'CRITICAL').length,
}), [tickets]);

const handleAssignOpen = (ticket) => {
  setAssignModal({ isOpen: true, ticket });
  setSelectedTechnician(ticket.technicianId || '');
};

const handleAssignConfirm = async ({ technicianId }) => {
  const tech = technicians.find(t => t.id === technicianId);
  try {
    await assignTechnician(assignModal.ticket.id, { technicianId: tech?.id || technicianId });
    setTickets(prev => prev.map(t =>
      t.id === assignModal.ticket.id ? { ...t, technicianId: tech?.id || technicianId, status: 'IN_PROGRESS' } : t
    ));
    setAssignModal({ isOpen: false, ticket: null });
  } catch (err) {
    alert('Failed to assign technician. Please try again.');
  }
};

const handleStatusChange = (ticketId, newStatus) => {
  setInlineStatus(prev => ({ ...prev, [ticketId]: newStatus }));
};

const handleStatusSave = async (ticketId) => {
  const newStatus = inlineStatus[ticketId];
  if (!newStatus) return;
  try {
    await updateTicketStatus(ticketId, { status: newStatus });
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    setInlineStatus(prev => { const next = { ...prev }; delete next[ticketId]; return next; });
  } catch (err) {
    alert("Failed to securely deploy administrative status change.");
  }
};

return (
  <div className="c-admin-tickets-page">
    {/* Header */}
    <div className="c-atp-header">
      <div>
        <h1>🛡️ Admin — All Tickets</h1>
        <p>Full visibility and control over all campus maintenance requests.</p>
      </div>
      <button className="c-atp-new-btn" onClick={() => navigate('/tickets/new')}>+ New Ticket</button>
    </div>

    {/* Stats Bar */}
    <div className="c-atp-stats-bar">
      {[
        { label: 'Total', value: stats.total, cls: '' },
        { label: 'Open', value: stats.open, cls: 'c-atp-stat-blue' },
        { label: 'In Progress', value: stats.inProgress, cls: 'c-atp-stat-amber' },
        { label: 'Resolved', value: stats.resolved, cls: 'c-atp-stat-green' },
        { label: 'Critical', value: stats.urgent, cls: 'c-atp-stat-red' },
      ].map(s => (
        <div key={s.label} className={`c-atp-stat ${s.cls}`}>
          <span className="c-atp-stat-val">{s.value}</span>
          <span className="c-atp-stat-lbl">{s.label}</span>
        </div>
      ))}
    </div>

    <div className="c-atp-layout">
      {/* Filter Sidebar */}
      <div className="c-atp-filters">
        <C_TicketFilters
          filters={filters}
          setFilters={setFilters}
          onApply={() => { }}
          onReset={() => setFilters({ status: '', priority: '', category: '', resourceType: '', technicianId: '', date: '' })}
        />
      </div>

      {/* Table */}
      <div className="c-atp-table-wrapper">
        <div className="c-atp-table-header">
          <span>Showing <strong>{filteredTickets.length}</strong> / {tickets.length} tickets</span>
        </div>
        <div className="c-atp-table-scroll">
          <table className="c-atp-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="c-atp-empty-row">Acquiring global administrative ticketing logs...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="c-atp-empty-row">{error}</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={8} className="c-atp-empty-row">No tickets match the current filters.</td></tr>
              ) : filteredTickets.map(ticket => {
                const pendingStatus = inlineStatus[ticket.id];
                return (
                  <tr key={ticket.id} className={ticket.priority === 'CRITICAL' ? 'c-atp-row-critical' : ''}>
                    <td className="c-atp-mono">{ticket.id}</td>
                    <td>{resourceMap[ticket.location] || ticket.location || <span className="c-atp-unassigned">N/A</span>}</td>
                    <td>{ticket.category ? ticket.category.replace('_', ' ') : '—'}</td>
                    <td><C_TicketPriorityBadge priority={ticket.priority} /></td>
                    <td>
                      <div className="c-atp-status-cell">
                        <C_TicketStatusBadge status={ticket.status} />
                        <select
                          className="c-atp-status-select"
                          value={pendingStatus || ''}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        >
                          <option value="">Change…</option>
                          {STATUS_OPTIONS.filter(s => s !== ticket.status).map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                        {pendingStatus && (
                          <button className="c-atp-save-status-btn" onClick={() => handleStatusSave(ticket.id)}>✓</button>
                        )}
                      </div>
                    </td>
                    <td>{technicians.find(t => t.id === ticket.technicianId)?.name || (ticket.technicianId ? ticket.technicianId : <span className="c-atp-unassigned">Unassigned</span>)}</td>
                    <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="c-atp-actions">
                        <button className="c-atp-btn c-atp-btn-view" onClick={() => navigate(`/tickets/${ticket.id}`)}>View</button>
                        <button className="c-atp-btn c-atp-btn-assign" onClick={() => handleAssignOpen(ticket)}>Assign</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Assign Modal */}
    <C_TechnicianAssignModal
      isOpen={assignModal.isOpen}
      ticket={assignModal.ticket}
      technicians={technicians}
      selectedTechnician={selectedTechnician}
      setSelectedTechnician={setSelectedTechnician}
      onClose={() => setAssignModal({ isOpen: false, ticket: null })}
      onConfirm={handleAssignConfirm}
    />
  </div>
  );
};

export default C_AdminTicketsPage;
