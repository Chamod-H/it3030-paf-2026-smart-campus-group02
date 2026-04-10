import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/P_AuthContext';
import C_TicketForm from '../../components/C_ticketing/C_TicketForm';
import './C_CreateTicketPage.css';
import { createTicket } from '../../services/C_ticketService';
import I_resourceService from '../../services/I_resourceService';

const initialFormData = {
  resourceId: '',
  category: '',
  priority: 'LOW',
  contactDetails: '',
  description: '',
  attachments: []
};

const C_CreateTicketPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await I_resourceService.getAllResources();
      setResources(data.map(r => ({ id: r.id, name: r.name, location: r.location })));
    } catch (err) {
      console.error('Failed to load resources:', err);
      // Fall back to empty - form will still work with manual entry
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.resourceId) newErrors.resourceId = 'Please select a resource or location.';
    if (!formData.category) newErrors.category = 'Please select an issue category.';
    if (!formData.priority) newErrors.priority = 'Please select a priority level.';
    if (!formData.contactDetails?.trim()) newErrors.contactDetails = 'Contact details are required.';
    if (!formData.description?.trim()) newErrors.description = 'A description of the issue is required.';
    else if (formData.description.trim().length < 20) newErrors.description = 'Please provide more detail (at least 20 characters).';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const hasFiles = formData.attachments && formData.attachments.length > 0;

      if (hasFiles) {
        // Send as multipart/form-data when there are file attachments
        const multipart = new FormData();

        // Attach ticket JSON as 'ticketData' part
        const ticketPayload = {
          reporterId: user?.email || 'Unknown',
          location: formData.resourceId,   // use resourceId as location identifier
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
        };
        multipart.append('ticketData', new Blob([JSON.stringify(ticketPayload)], { type: 'application/json' }));

        // Attach first image as 'file' part (backend accepts one file)
        multipart.append('file', formData.attachments[0]);

        await createTicket(multipart);
      } else {
        // Send as plain JSON when no file
        const ticketPayload = {
          reporterId: user?.email || 'Unknown',
          location: formData.resourceId,
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
        };
        await createTicket(ticketPayload);
      }

      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (err) {
      console.error('Ticket submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="c-create-ticket-page">
      {/* Page Header */}
      <div className="c-ctp-header">
        <button className="c-ctp-back-btn" onClick={() => navigate('/tickets')}>
          ← Back to Tickets
        </button>
        <div>
          <h1>🛠️ Report a Maintenance Issue</h1>
          <p>Describe the problem and attach photos. Your ticket will be submitted as <strong>OPEN</strong> and assigned to a technician.</p>
        </div>
      </div>

      {/* Success Alert */}
      {submitStatus === 'success' && (
        <div className="c-ctp-alert c-ctp-alert-success">
          <span>✅</span>
          <div>
            <strong>Ticket submitted successfully!</strong>
            <p>Your issue has been logged and will be reviewed shortly. You can track it in <button onClick={() => navigate('/tickets/my')}>My Tickets</button>.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {submitStatus === 'error' && (
        <div className="c-ctp-alert c-ctp-alert-error">
          <span>❌</span>
          <div>
            <strong>Submission failed.</strong>
            <p>An error occurred while submitting your ticket. Please try again.</p>
          </div>
        </div>
      )}

      {/* Validation summary if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="c-ctp-alert c-ctp-alert-warn">
          <span>⚠️</span>
          <div>
            <strong>Please fix the following before submitting:</strong>
            <ul>
              {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="c-ctp-form-wrapper">
        {isSubmitting && (
          <div className="c-ctp-submitting-overlay">
            <div className="c-ctp-spinner"></div>
            <span>Submitting your ticket...</span>
          </div>
        )}
        <C_TicketForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          resources={resources}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tickets')}
          mode="add"
        />
      </div>
    </div>
  );
};

export default C_CreateTicketPage;
