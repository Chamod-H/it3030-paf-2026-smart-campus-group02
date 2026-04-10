import React, { useState } from 'react';
import './C_TicketForm.css';
import C_TicketAttachmentUploader from './C_TicketAttachmentUploader';

/**
 * Main component for initializing or editing a Maintenance Incident Ticket (Module C).
 */
const C_TicketForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  errors,
  resources = [],
  mode = 'add'
}) => {
  const [fieldErrors, setFieldErrors] = useState({});

  const validateContactDetails = (value) => {
    if (!value || !value.trim()) return 'Mobile number cannot be empty.';
    if (!/^\d{10}$/.test(value.trim())) return 'Mobile number must be exactly 10 digits.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'contactDetails') {
      setFieldErrors(prev => ({ ...prev, contactDetails: validateContactDetails(value) }));
    }
  };

  const handleAttachmentsChange = (filesUpdater) => {
    setFormData(prev => {
      const newFiles = typeof filesUpdater === 'function' ? filesUpdater(prev.attachments || []) : filesUpdater;
      return { ...prev, attachments: newFiles };
    });
  };

  return (
    <div className="c-ticket-form-wrapper">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="c-ticket-form">
        <div className="c-tf-grid">
          {/* Resource Location */}
          <div className="c-tf-field-group">
            <label htmlFor="resourceId">Affected Resource / Location <span className="c-tf-required">*</span></label>
            <select
              id="resourceId"
              name="resourceId"
              value={formData.resourceId || ''}
              onChange={handleChange}
              className={errors.resourceId ? 'c-tf-error-input' : ''}
            >
              <option value="">-- Select Target Location --</option>
              {resources.map(res => (
                <option key={res.id} value={res.id}>{res.location || res.name}</option>
              ))}
            </select>
            {errors.resourceId && <span className="c-tf-error-text">{errors.resourceId}</span>}
          </div>

          {/* Issue Category */}
          <div className="c-tf-field-group">
            <label htmlFor="category">Issue Category <span className="c-tf-required">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              className={errors.category ? 'c-tf-error-input' : ''}
            >
              <option value="">-- Select Category --</option>
              <option value="HVAC">HVAC / Air Conditioning</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="AV_EQUIPMENT">AV / IT Equipment</option>
              <option value="STRUCTURAL">Structural Damage</option>
              <option value="CLEANING">Cleaning / Hygiene</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.category && <span className="c-tf-error-text">{errors.category}</span>}
          </div>

          {/* Priority */}
          <div className="c-tf-field-group">
            <label htmlFor="priority">Estimated Priority <span className="c-tf-required">*</span></label>
            <select
              id="priority"
              name="priority"
              value={formData.priority || 'LOW'}
              onChange={handleChange}
              className={errors.priority ? 'c-tf-error-input' : ''}
            >
              <option value="LOW">Low - No immediate impact</option>
              <option value="MEDIUM">Medium - Partial disruption</option>
              <option value="HIGH">High - Significant disruption</option>
              <option value="CRITICAL">Critical / Urgent - Safety risk or unusable resource</option>
            </select>
            {errors.priority && <span className="c-tf-error-text">{errors.priority}</span>}
          </div>

          {/* Contact Details */}
          <div className="c-tf-field-group">
            <label htmlFor="contactDetails">Preferred Contact Details <span className="c-tf-required">*</span></label>
            <input
              type="tel"
              id="contactDetails"
              name="contactDetails"
              value={formData.contactDetails || ''}
              onChange={handleChange}
              placeholder="07XXXXXXXX (10 digits)"
              className={('contactDetails' in fieldErrors ? fieldErrors.contactDetails : errors.contactDetails) ? 'c-tf-error-input' : ''}
            />
            {(() => {
              const contactErr = 'contactDetails' in fieldErrors ? fieldErrors.contactDetails : errors.contactDetails;
              return contactErr ? <span className="c-tf-error-text">{contactErr}</span> : null;
            })()}
          </div>

          {/* Description */}
          <div className="c-tf-field-group c-tf-full-width">
            <label htmlFor="description">Detailed Description <span className="c-tf-required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="5"
              placeholder="Please describe the issue..."
              className={errors.description ? 'c-tf-error-input' : ''}
            />
            {errors.description && <span className="c-tf-error-text">{errors.description}</span>}
          </div>

          {/* Attachment Uploader */}
          <div className="c-tf-field-group c-tf-full-width">
            <label>Attachments (Max 3 Images)</label>
            <C_TicketAttachmentUploader 
              files={formData.attachments || []}
              setFiles={handleAttachmentsChange}
              maxFiles={3}
              maxSizeMB={5}
              error={errors.attachments}
            />
          </div>
        </div>

        {/* Global Error Banner */}
        {errors.global && (
          <div className="c-tf-global-error">
            ⚠️ {errors.global}
          </div>
        )}

        <div className="c-tf-actions">
          <button type="button" onClick={onCancel} className="c-tf-btn-cancel">
            Cancel
          </button>
          <button type="submit" className="c-tf-btn-submit">
            {mode === 'edit' ? 'Update Ticket' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default C_TicketForm;
