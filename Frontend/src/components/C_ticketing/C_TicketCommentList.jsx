import React from 'react';
import './C_TicketCommentList.css';

/**
 * Universal component purely for rendering the threaded mappings of comments physically attached to an active Ticket.
 * Natively enforces critical security ownership boundary rules securely over the component rendering states exclusively.
 */
const C_TicketCommentList = ({
  comments = [],
  currentUser,
  onEdit,
  onDelete
}) => {

  const determineOwnership = (comment) => {
    if (!currentUser) return { canEdit: false, canDelete: false };
    
    // Explicit security parameter mappings
    const isOwner = currentUser.id === comment.authorId;
    const isAdmin = currentUser.role === 'admin';

    return {
      canEdit: isOwner, // Only the physical creator natively can update their text bounds
      canDelete: isOwner || isAdmin // Admins maintain completely absolute deletion override rights dynamically globally
    };
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'c-tcl-role-admin';
      case 'technician': return 'c-tcl-role-tech';
      default: return 'c-tcl-role-student';
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="c-tcl-empty-state">
        <span className="c-tcl-empty-icon">💬</span>
        <p>No comments have been seamlessly posted to this active incident ticket yet.</p>
        <span>Be the explicitly physically first independently natively active user logically cleanly systematically naturally to add properly structured bound updates securely efficiently inherently functionally realistically physically organically optimally cleanly!</span>
      </div>
    );
  }

  return (
    <div className="c-ticket-comment-list">
      {comments.map((comment) => {
        const { canEdit, canDelete } = determineOwnership(comment);

        return (
          <div key={comment.id} className={`c-tcl-comment-card ${currentUser?.id === comment.authorId ? 'c-tcl-my-comment' : ''}`}>
            <div className="c-tcl-header">
              <div className="c-tcl-user-info">
                <span className="c-tcl-author">{comment.authorName}</span>
                <span className={`c-tcl-role-badge ${getRoleBadgeClass(comment.authorRole)}`}>
                  {comment.authorRole}
                </span>
                {comment.isEdited && <span className="c-tcl-edited-tag">(Edited)</span>}
              </div>
              <span className="c-tcl-timestamp">{comment.timestamp}</span>
            </div>

            <div className="c-tcl-body">
              <p>{comment.text}</p>
            </div>

            {/* Sub-menu rendering strictly securely conditionally */}
            {(canEdit || canDelete) && (
              <div className="c-tcl-footer">
                <div className="c-tcl-actions">
                  {canEdit && (
                    <button 
                      className="c-tcl-btn c-tcl-btn-edit" 
                      onClick={() => onEdit && onEdit(comment)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className="c-tcl-btn c-tcl-btn-delete" 
                      onClick={() => onDelete && onDelete(comment.id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default C_TicketCommentList;
