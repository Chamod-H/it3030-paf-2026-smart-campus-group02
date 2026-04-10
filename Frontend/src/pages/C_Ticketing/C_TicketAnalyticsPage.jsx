import React, { useMemo } from 'react';
import './C_TicketAnalyticsPage.css';

const mockTickets = [
  { id: 'TK-1001', category: 'ELECTRICAL',   priority: 'HIGH',     status: 'IN_PROGRESS', createdDate: '2026-05-14', resolvedDate: null },
  { id: 'TK-1002', category: 'AV_EQUIPMENT', priority: 'CRITICAL', status: 'OPEN',        createdDate: '2026-05-13', resolvedDate: null },
  { id: 'TK-1003', category: 'HVAC',          priority: 'MEDIUM',   status: 'OPEN',        createdDate: '2026-05-12', resolvedDate: null },
  { id: 'TK-1004', category: 'PLUMBING',      priority: 'HIGH',     status: 'RESOLVED',    createdDate: '2026-05-10', resolvedDate: '2026-05-12' },
  { id: 'TK-1005', category: 'CLEANING',      priority: 'LOW',      status: 'CLOSED',      createdDate: '2026-05-08', resolvedDate: '2026-05-09' },
  { id: 'TK-1006', category: 'STRUCTURAL',    priority: 'HIGH',     status: 'OPEN',        createdDate: '2026-05-07', resolvedDate: null },
  { id: 'TK-1007', category: 'ELECTRICAL',    priority: 'MEDIUM',   status: 'RESOLVED',    createdDate: '2026-05-06', resolvedDate: '2026-05-08' },
  { id: 'TK-1008', category: 'HVAC',          priority: 'LOW',      status: 'CLOSED',      createdDate: '2026-05-05', resolvedDate: '2026-05-07' },
  { id: 'TK-1009', category: 'AV_EQUIPMENT', priority: 'HIGH',     status: 'IN_PROGRESS', createdDate: '2026-05-04', resolvedDate: null },
  { id: 'TK-1010', category: 'CLEANING',      priority: 'LOW',      status: 'REJECTED',    createdDate: '2026-05-03', resolvedDate: null },
];

const PRIORITY_CONFIG = {
  CRITICAL: { color: '#ef4444', bg: '#fef2f2', label: 'Critical' },
  HIGH:     { color: '#f97316', bg: '#fff7ed', label: 'High' },
  MEDIUM:   { color: '#eab308', bg: '#fefce8', label: 'Medium' },
  LOW:      { color: '#22c55e', bg: '#f0fdf4', label: 'Low' },
};

const CATEGORY_CONFIG = {
  ELECTRICAL:   { icon: '⚡', color: '#facc15' },
  AV_EQUIPMENT: { icon: '🖥️', color: '#60a5fa' },
  HVAC:         { icon: '❄️', color: '#38bdf8' },
  PLUMBING:     { icon: '🔧', color: '#818cf8' },
  STRUCTURAL:   { icon: '🏗️', color: '#fb923c' },
  CLEANING:     { icon: '🧹', color: '#4ade80' },
  OTHER:        { icon: '📋', color: '#94a3b8' },
};

const STATUS_CONFIG = {
  OPEN:        { color: '#3b82f6', label: 'Open' },
  IN_PROGRESS: { color: '#f59e0b', label: 'In Progress' },
  RESOLVED:    { color: '#10b981', label: 'Resolved' },
  CLOSED:      { color: '#6b7280', label: 'Closed' },
  REJECTED:    { color: '#ef4444', label: 'Rejected' },
};

const daysBetween = (d1, d2) => {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.max(0, Math.round((t2 - t1) / (1000 * 60 * 60 * 24)));
};

const C_TicketAnalyticsPage = () => {
  const analytics = useMemo(() => {
    const total = mockTickets.length;
    const statusCounts = {};
    const priorityCounts = {};
    const categoryCounts = {};
    const resolutionDays = [];

    mockTickets.forEach(t => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
      if (t.resolvedDate) resolutionDays.push(daysBetween(t.createdDate, t.resolvedDate));
    });

    const avgResolutionDays = resolutionDays.length
      ? (resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length).toFixed(1)
      : 'N/A';

    const maxCategoryCount = Math.max(...Object.values(categoryCounts));
    const maxPriorityCount = Math.max(...Object.values(priorityCounts));

    return { total, statusCounts, priorityCounts, categoryCounts, avgResolutionDays, maxCategoryCount, maxPriorityCount };
  }, []);

  return (
    <div className="c-ticket-analytics-page">
      {/* Header */}
      <div className="c-tap-header">
        <h1>📊 Ticket Analytics</h1>
        <p>Live insights across all campus maintenance tickets.</p>
      </div>

      {/* KPI Cards */}
      <div className="c-tap-kpi-grid">
        <div className="c-tap-kpi c-tap-kpi-blue">
          <span className="c-tap-kpi-icon">🎫</span>
          <div><span className="c-tap-kpi-val">{analytics.total}</span><span className="c-tap-kpi-lbl">Total Tickets</span></div>
        </div>
        <div className="c-tap-kpi c-tap-kpi-orange">
          <span className="c-tap-kpi-icon">📂</span>
          <div><span className="c-tap-kpi-val">{analytics.statusCounts['OPEN'] || 0}</span><span className="c-tap-kpi-lbl">Open</span></div>
        </div>
        <div className="c-tap-kpi c-tap-kpi-amber">
          <span className="c-tap-kpi-icon">⚙️</span>
          <div><span className="c-tap-kpi-val">{analytics.statusCounts['IN_PROGRESS'] || 0}</span><span className="c-tap-kpi-lbl">In Progress</span></div>
        </div>
        <div className="c-tap-kpi c-tap-kpi-green">
          <span className="c-tap-kpi-icon">✅</span>
          <div><span className="c-tap-kpi-val">{(analytics.statusCounts['RESOLVED'] || 0) + (analytics.statusCounts['CLOSED'] || 0)}</span><span className="c-tap-kpi-lbl">Resolved / Closed</span></div>
        </div>
        <div className="c-tap-kpi c-tap-kpi-red">
          <span className="c-tap-kpi-icon">🚨</span>
          <div><span className="c-tap-kpi-val">{analytics.priorityCounts['CRITICAL'] || 0}</span><span className="c-tap-kpi-lbl">Critical</span></div>
        </div>
        <div className="c-tap-kpi c-tap-kpi-purple">
          <span className="c-tap-kpi-icon">⏱️</span>
          <div><span className="c-tap-kpi-val">{analytics.avgResolutionDays}</span><span className="c-tap-kpi-lbl">Avg. Resolution (days)</span></div>
        </div>
      </div>

      <div className="c-tap-charts-row">
        {/* Status Donut (CSS pie using conic-gradient) */}
        <div className="c-tap-chart-card">
          <h2>Tickets by Status</h2>
          <div className="c-tap-status-list">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const count = analytics.statusCounts[status] || 0;
              const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
              return (
                <div key={status} className="c-tap-status-row">
                  <div className="c-tap-status-label">
                    <span className="c-tap-status-dot" style={{ backgroundColor: cfg.color }}></span>
                    <span>{cfg.label}</span>
                  </div>
                  <div className="c-tap-bar-track">
                    <div className="c-tap-bar-fill" style={{ width: `${pct}%`, backgroundColor: cfg.color }}></div>
                  </div>
                  <span className="c-tap-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="c-tap-chart-card">
          <h2>Tickets by Priority</h2>
          <div className="c-tap-bar-chart">
            {Object.entries(PRIORITY_CONFIG).map(([priority, cfg]) => {
              const count = analytics.priorityCounts[priority] || 0;
              const heightPct = analytics.maxPriorityCount > 0 ? (count / analytics.maxPriorityCount) * 100 : 0;
              return (
                <div key={priority} className="c-tap-bar-col">
                  <span className="c-tap-bar-val">{count}</span>
                  <div className="c-tap-bar-outer">
                    <div className="c-tap-bar-inner" style={{ height: `${heightPct}%`, backgroundColor: cfg.color }}></div>
                  </div>
                  <span className="c-tap-bar-name">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="c-tap-chart-card">
        <h2>Tickets by Category</h2>
        <div className="c-tap-category-grid">
          {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
            const count = analytics.categoryCounts[cat] || 0;
            const pct = analytics.maxCategoryCount > 0 ? Math.round((count / analytics.maxCategoryCount) * 100) : 0;
            return (
              <div key={cat} className="c-tap-cat-row">
                <div className="c-tap-cat-label">
                  <span>{cfg.icon}</span>
                  <span>{cat.replace('_', ' ')}</span>
                </div>
                <div className="c-tap-bar-track">
                  <div className="c-tap-bar-fill" style={{ width: `${pct}%`, backgroundColor: cfg.color }}></div>
                </div>
                <span className="c-tap-bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default C_TicketAnalyticsPage;
