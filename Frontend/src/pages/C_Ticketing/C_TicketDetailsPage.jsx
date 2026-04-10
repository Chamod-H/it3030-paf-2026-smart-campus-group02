import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import C_TicketStatusBadge from '../../components/C_ticketing/C_TicketStatusBadge';
import C_TicketPriorityBadge from '../../components/C_ticketing/C_TicketPriorityBadge';
import C_TicketImagePreview from '../../components/C_ticketing/C_TicketImagePreview';
import C_TicketCommentList from '../../components/C_ticketing/C_TicketCommentList';
import C_TicketCommentForm from '../../components/C_ticketing/C_TicketCommentForm';
import C_ResolutionNoteBox from '../../components/C_ticketing/C_ResolutionNoteBox';
import './C_TicketDetailsPage.css';
import { getTicketById, updateTicketStatus, resolveTicket } from '../../services/C_ticketService';
import P_authService from '../../services/P_authService';
import { getUserById } from '../../services/P_userService';

const UPDATABLE_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const C_TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [commentErrors, setCommentErrors] = useState({});
  const [resolutionNote, setResolutionNote] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [reporterEmail, setReporterEmail] = useState(null);
  const [technicianName, setTechnicianName] = useState(null);

  useEffect(() => {
    fetchTicket();
    fetchCurrentUser();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const data = await getTicketById(id);
      setTicket(data);
      setCurrentStatus(data.status);
      setResolutionNote(data.resolveNote || '');

      if (data.reporterId && !data.reporterId.includes('@')) {
        try {
          const rUser = await getUserById(data.reporterId);
          setReporterEmail(rUser.email);
        } catch (e) {
          console.error('Failed to resolve reporter email', e);
        }
      }

      if (data.technicianId) {
        try {
          const tUser = await getUserById(data.technicianId);
          setTechnicianName(tUser.username || tUser.name || tUser.email);
        } catch (e) {
          console.error('Failed to resolve technician name', e);
        }
      }
    } catch (err) {
      console.error('Failed to load ticket:', err);
      setError('Could not load ticket details. Please go back and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await P_authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const userRole = currentUser?.role?.toLowerCase() || 'student';
  const canUpdateStatus = userRole === 'admin' || userRole === 'staff_member';
  const isResolved = currentStatus === 'RESOLVED' || currentStatus === 'CLOSED';

  const handleStatusSave = async () => {
    if (!currentStatus) return;
    setStatusSaving(true);
    try {
      await updateTicketStatus(id, { status: currentStatus });
      setTicket(prev => ({ ...prev, status: currentStatus }));
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setStatusSaving(false);
    }
  };

  const handleSaveResolution = async (note) => {
    try {
      await resolveTicket(id, { resolutionNote: note });
      setResolutionNote(note);
      setCurrentStatus('RESOLVED');
      setTicket(prev => ({ ...prev, status: 'RESOLVED', resolveNote: note }));
    } catch (err) {
      alert('Failed to save resolution note.');
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) {
      setCommentErrors({ comment: 'Comment cannot be empty.' });
      return;
    }
    setCommentErrors({});
    const newComment = {
      id: `c${Date.now()}`,
      authorId: currentUser?.id || 'unknown',
      authorName: currentUser?.username || currentUser?.email || 'User',
      authorRole: currentUser?.role || 'Student',
      text: commentText.trim(),
      timestamp: new Date().toLocaleString(),
      isEdited: false
    };
    setTicket(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
    setCommentText('');
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.text);
  };

  const handleSaveEdit = () => {
    if (!commentText.trim()) {
      setCommentErrors({ comment: 'Comment cannot be empty.' });
      return;
    }
    setTicket(prev => ({
      ...prev,
      comments: (prev.comments || []).map(c =>
        c.id === editingComment.id ? { ...c, text: commentText.trim(), isEdited: true } : c
      )
    }));
    setEditingComment(null);
    setCommentText('');
    setCommentErrors({});
  };

  const handleDeleteComment = (commentId) => {
    setTicket(prev => ({
      ...prev,
      comments: (prev.comments || []).filter(c => c.id !== commentId)
    }));
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setCommentText('');
    setCommentErrors({});
  };

  if (loading) {
    return (
      <div className="c-ticket-details-page">
        <div className="c-tdp-loading">Loading ticket details...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="c-ticket-details-page">
        <button className="c-tdp-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="c-tdp-error">{error || 'Ticket not found.'}</div>
      </div>
    );
  }

  const comments = ticket.comments || [];
  const imageUrl = ticket.imageUrl;

  return (
    <div className="c-ticket-details-page">
      {/* Back Navigation */}
      <button className="c-tdp-back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Page Header */}
      <div className="c-tdp-header">
        <div className="c-tdp-title-row">
          <h1>Ticket <span className="c-tdp-mono">{ticket.id}</span></h1>
          <div className="c-tdp-badges">
            <C_TicketPriorityBadge priority={ticket.priority} />
            <C_TicketStatusBadge status={currentStatus} />
          </div>
        </div>
      </div>

      <div className="c-tdp-layout">
        {/* ── Main Content ── */}
        <div className="c-tdp-main">
          {/* Core Info Card */}
          <section className="c-tdp-card">
            <h2>Incident Details</h2>
            <div className="c-tdp-info-grid">
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Location</span><span>{ticket.location || '—'}</span></div>
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Category</span><span>{ticket.category ? ticket.category.replace(/_/g, ' ') : '—'}</span></div>
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Priority</span><span>{ticket.priority || '—'}</span></div>
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Date Reported</span><span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—'}</span></div>
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Reporter ID</span><span>{reporterEmail || ticket.reporterId || '—'}</span></div>
              <div className="c-tdp-info-item"><span className="c-tdp-lbl">Assigned To</span><span>{technicianName || ticket.technicianId || <em>Unassigned</em>}</span></div>
            </div>
            <div className="c-tdp-description">
              <span className="c-tdp-lbl">Full Description</span>
              <p>{ticket.description || 'No description provided.'}</p>
            </div>
          </section>

          {/* Photo Attachment */}
          {imageUrl && (
            <section className="c-tdp-card">
              <h2>Attached Photo</h2>
              <div className="c-tdp-image-wrapper">
                <img
                  src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`}
                  alt="Ticket attachment"
                  className="c-tdp-attachment-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </section>
          )}

          {/* Resolution Notes */}
          {(canUpdateStatus || isResolved) && (
            <section className="c-tdp-card" id="resolution">
              <h2>Resolution</h2>
              <C_ResolutionNoteBox
                resolutionNote={resolutionNote}
                setResolutionNote={setResolutionNote}
                onSave={handleSaveResolution}
                editable={canUpdateStatus && !isResolved}
                resolvedBy={ticket.resolveNote ? ticket.technicianId : null}
                resolvedAt={isResolved ? ticket.updatedAt : null}
              />
            </section>
          )}

          {/* Comments */}
          <section className="c-tdp-card" id="comments">
            <h2>Comments ({comments.length})</h2>
            <C_TicketCommentList
              comments={comments}
              currentUser={currentUser ? { id: currentUser.id, name: currentUser.username || currentUser.email } : null}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
            <div className="c-tdp-comment-form-wrapper">
              <C_TicketCommentForm
                value={commentText}
                setValue={setCommentText}
                onSubmit={editingComment ? handleSaveEdit : handlePostComment}
                onCancel={editingComment ? handleCancelEdit : null}
                mode={editingComment ? 'edit' : 'add'}
                errors={commentErrors}
              />
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="c-tdp-sidebar">
          {/* Assignment Panel */}
          <div className="c-tdp-sidebar-card">
            <h3>Assignment</h3>
            <div className="c-tdp-sidebar-row">
              <span className="c-tdp-lbl">Technician Name</span>
              <span>{technicianName || ticket.technicianId || <em>Unassigned</em>}</span>
            </div>
            {ticket.assignNote && (
              <div className="c-tdp-sidebar-row">
                <span className="c-tdp-lbl">Note</span>
                <span>{ticket.assignNote}</span>
              </div>
            )}
            {ticket.updatedAt && (
              <div className="c-tdp-sidebar-row">
                <span className="c-tdp-lbl">Last Updated</span>
                <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Status Update Panel (admin/staff only) */}
          {canUpdateStatus && (
            <div className="c-tdp-sidebar-card">
              <h3>Update Status</h3>
              <select
                className="c-tdp-status-select"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
              >
                {UPDATABLE_STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <button
                className="c-tdp-status-save-btn"
                onClick={handleStatusSave}
                disabled={statusSaving || currentStatus === ticket.status}
              >
                {statusSaving ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default C_TicketDetailsPage;
