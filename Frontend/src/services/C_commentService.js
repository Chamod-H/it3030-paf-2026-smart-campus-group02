import axios from 'axios';

const TICKET_BASE = '/api/tickets';
const COMMENT_BASE = '/api/comments';

/**
 * Fetch all comments for a specific ticket.
 * GET /api/tickets/:ticketId/comments
 * @param {string} ticketId
 */
export const getCommentsByTicketId = async (ticketId) => {
  const response = await axios.get(`${TICKET_BASE}/${ticketId}/comments`);
  return response.data;
};

/**
 * Post a new comment on a ticket.
 * POST /api/tickets/:ticketId/comments
 * @param {string} ticketId
 * @param {{ text: string }} data
 */
export const addComment = async (ticketId, data) => {
  const response = await axios.post(`${TICKET_BASE}/${ticketId}/comments`, data);
  return response.data;
};

/**
 * Edit an existing comment by its ID.
 * PUT /api/comments/:commentId
 * @param {string} commentId
 * @param {{ text: string }} data
 */
export const updateComment = async (commentId, data) => {
  const response = await axios.put(`${COMMENT_BASE}/${commentId}`, data);
  return response.data;
};

/**
 * Delete a comment by its ID (owner or admin).
 * DELETE /api/comments/:commentId
 * @param {string} commentId
 */
export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${COMMENT_BASE}/${commentId}`);
  return response.data;
};
