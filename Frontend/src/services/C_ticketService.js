import api from './api';

const BASE_URL = '/tickets';

// ─────────────────────────────────────────────
// GET Requests
// ─────────────────────────────────────────────

/**
 * Fetch all tickets (admin / staff).
 * GET /api/tickets
 */
export const getAllTickets = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

/**
 * Fetch only tickets submitted by the currently authenticated user.
 * GET /api/tickets/my
 */
export const getMyTickets = async () => {
  const response = await api.get(`${BASE_URL}/my`);
  return response.data;
};

/**
 * Fetch tickets assigned to the currently authenticated technician.
 * GET /api/tickets/my-assigned
 */
export const getTechnicianTickets = async () => {
  const response = await api.get(`${BASE_URL}/my-assigned`);
  return response.data;
};

/**
 * Fetch a single ticket by its ID.
 * GET /api/tickets/:id
 */
export const getTicketById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Fetch tickets with optional query filters.
 * GET /api/tickets?status=OPEN&priority=HIGH&category=ELECTRICAL&...
 * @param {Object} params - { status, priority, category, resourceId, date, technicianId }
 */
export const filterTickets = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

// ─────────────────────────────────────────────
// POST / Create
// ─────────────────────────────────────────────

/**
 * Create a new maintenance ticket.
 * POST /api/tickets
 * @param {FormData|Object} formData - Supports multipart/form-data for image attachments.
 */
export const createTicket = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await api.post(BASE_URL, formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return response.data;
};

// ─────────────────────────────────────────────
// PUT / Full Update
// ─────────────────────────────────────────────

/**
 * Update a ticket's core fields (category, description, priority, contact details).
 * PUT /api/tickets/:id
 * @param {string} id
 * @param {Object} data
 */
export const updateTicket = async (id, data) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// ─────────────────────────────────────────────
// PATCH / Workflow Transitions
// ─────────────────────────────────────────────

/**
 * Assign a technician to a ticket.
 * PATCH /api/tickets/:id/assign
 * @param {string} id
 * @param {{ technicianId: string, note?: string }} payload
 */
export const assignTechnician = async (id, payload) => {
  const response = await api.patch(`${BASE_URL}/${id}/assign`, payload);
  return response.data;
};

/**
 * Update the status of a ticket (e.g. OPEN → IN_PROGRESS).
 * PATCH /api/tickets/:id/status
 * @param {string} id
 * @param {{ status: string }} payload
 */
export const updateTicketStatus = async (id, payload) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, payload);
  return response.data;
};

/**
 * Reject a ticket with a mandatory reason.
 * PATCH /api/tickets/:id/reject
 * @param {string} id
 * @param {{ reason: string }} payload
 */
export const rejectTicket = async (id, payload) => {
  const response = await api.patch(`${BASE_URL}/${id}/reject`, payload);
  return response.data;
};

/**
 * Mark a ticket as resolved with a resolution note.
 * PATCH /api/tickets/:id/resolve
 * @param {string} id
 * @param {{ resolutionNote: string }} payload
 */
export const resolveTicket = async (id, payload) => {
  const response = await api.patch(`${BASE_URL}/${id}/resolve`, payload);
  return response.data;
};

/**
 * Close a resolved ticket permanently.
 * PATCH /api/tickets/:id/close
 * @param {string} id
 */
export const closeTicket = async (id) => {
  const response = await api.patch(`${BASE_URL}/${id}/close`);
  return response.data;
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

/**
 * Delete a ticket (admin only — use with caution).
 * DELETE /api/tickets/:id
 * @param {string} id
 */
export const deleteTicket = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};
