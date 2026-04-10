import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import C_TicketCard from '../../components/C_ticketing/C_TicketCard';
import './C_MyTicketsPage.css';
import { getMyTickets } from '../../services/C_ticketService';
import I_resourceService from '../../services/I_resourceService';
import { useAuth } from '../../contexts/P_AuthContext';

// Tickets will be fetched directly from the unified backend endpoints via C_ticketService

const STATUS_OPTIONS = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIORITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const CATEGORY_OPTIONS = ['', 'HVAC', 'PLUMBING', 'ELECTRICAL', 'AV_EQUIPMENT', 'STRUCTURAL', 'CLEANING', 'OTHER'];

const C_MyTicketsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || 'student';
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const [ticketsData, resourcesData] = await Promise.all([
        getMyTickets(),
        I_resourceService.getAllResources().catch(() => [])
      ]);

      const resourceMap = {};
      resourcesData.forEach(r => {
        resourceMap[r.id] = r.name;
      });

      const mappedTickets = ticketsData.map(ticket => ({
        ...ticket,
        resourceName: resourceMap[ticket.location] || ticket.location
      }));

      setMyTickets(mappedTickets);
    } catch (err) {
      console.error("Failed to load user tickets:", err);
      setError("Failed to load your tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return myTickets.filter(t => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      return true;
    });
  }, [filters, myTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ status: '', priority: '', category: '' });

  return (
    <div className="c-my-tickets-page">
      {/* Header */}
      <div className="c-mtp-header">
        <div>
          <h1>📂 My Tickets</h1>
          <p>Track all the maintenance issues you have submitted.</p>
        </div>
        <button className="c-mtp-new-btn" onClick={() => navigate('/tickets/new')}>
          + Report New Issue
        </button>
      </div>

      {/* Inline Filter Bar */}
      <div className="c-mtp-filter-bar">
        <div className="c-mtp-filter-group">
          <label htmlFor="f-status">Status</label>
          <select id="f-status" name="status" value={filters.status} onChange={handleFilterChange}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
        </div>
        <div className="c-mtp-filter-group">
          <label htmlFor="f-priority">Priority</label>
          <select id="f-priority" name="priority" value={filters.priority} onChange={handleFilterChange}>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
          </select>
        </div>
        <div className="c-mtp-filter-group">
          <label htmlFor="f-category">Category</label>
          <select id="f-category" name="category" value={filters.category} onChange={handleFilterChange}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
        </div>
        <button className="c-mtp-reset-btn" onClick={resetFilters}>Clear</button>
      </div>

      {/* Results Summary */}
      <div className="c-mtp-results-info">
        Showing <strong>{filteredTickets.length}</strong> of <strong>{myTickets.length}</strong> tickets
      </div>

      {/* Ticket Cards */}
      {loading ? (
        <div className="c-mtp-empty">
          <p>Retrieving your ticket history securely from the core database...</p>
        </div>
      ) : error ? (
        <div className="c-mtp-empty">
          <p>{error}</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="c-mtp-empty">
          <span>📭</span>
          <p>No tickets match your current filters.</p>
          <button onClick={resetFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className="c-mtp-grid">
          {filteredTickets.map(ticket => (
            <C_TicketCard
              key={ticket.id}
              ticket={ticket}
              userRole={userRole}
              onView={(t) => navigate(`/tickets/${t.id}`)}
              onEdit={(t) => navigate(`/tickets/${t.id}/edit`)}
              onComment={(t) => navigate(`/tickets/${t.id}#comments`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default C_MyTicketsPage;
