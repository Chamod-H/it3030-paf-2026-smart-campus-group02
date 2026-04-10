import React from 'react';
import './T_BookingForm.css';

/**
 * Reusable form component for creating and editing resource booking requests.
 * 
 * @param {Object} formData - State containing form values
 * @param {Function} setFormData - State setter for form values
 * @param {Function} onSubmit - Form submission handler function
 * @param {Function} onCancel - Handled when cancel is clicked
 * @param {Object} errors - Dictionary of validation errors
 * @param {Array} resources - List of resources for the dropdown
 * @param {Object} conflictInfo - Info related to booking overlaps { hasConflict: boolean, message: string }
 * @param {string} mode - "add" or "edit"
 */
const T_BookingForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  errors = {},
  resources = [],
  resourcesLoading = false,
  conflictInfo = null,
  mode = "add"
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedResource = resources.find(r => String(r.id) === String(formData.resourceId));

  return (
    <div className="t-booking-form-wrapper">
      <form 
        className="t-booking-form" 
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        {/* Conflict Warning Area (Can be externally triggered via T_ConflictAlert abstraction later) */}
        {conflictInfo?.hasConflict && (
          <div className="t-conflict-alert">
            <span className="t-conflict-icon">⚠️</span>
            <div className="t-conflict-text">
              <strong>Time Slot Unavailable</strong>
              <p>{conflictInfo.message}</p>
            </div>
          </div>
        )}

        {/* Section 1: Resource & Schedule */}
        <div className="t-form-section">
          <h3>Booking Details</h3>
          
          <div className="t-form-group">
            <label htmlFor="resourceId">Facility / Resource <span className="t-required">*</span></label>
            <select 
              id="resourceId"
              name="resourceId" 
              value={formData.resourceId || ''} 
              onChange={handleChange}
              className={`t-input ${errors.resourceId ? 't-input-error' : ''}`}
            >
              <option value="" disabled>
                {resourcesLoading ? 'Loading resources...' : '-- Select a Resource --'}
              </option>
              {!resourcesLoading && resources.filter(res => res.type !== 'Equipment' && res.status === 'ACTIVE').map(res => (
                <option key={res.id} value={res.id}>
                  {res.name} {res.capacity ? `(Cap: ${res.capacity})` : ''}
                </option>
              ))}
            </select>
            {errors.resourceId && <span className="t-error-msg">{errors.resourceId}</span>}
            {selectedResource?.status === 'OUT_OF_SERVICE' && (
              <span className="t-warning-msg">Note: This resource is currently marked as heavily restricted or out of service.</span>
            )}
          </div>

          <div className="t-form-row">
            <div className="t-form-group">
              <label htmlFor="bookingDate">Date <span className="t-required">*</span></label>
              <input 
                type="date" 
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate || ''}
                onChange={handleChange}
                className={`t-input ${errors.bookingDate ? 't-input-error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.bookingDate && <span className="t-error-msg">{errors.bookingDate}</span>}
            </div>
          </div>

          {/* Connected Time Selectors */}
          <div className="t-form-row">
            <div className="t-form-group">
              <label htmlFor="startTime">Start Time <span className="t-required">*</span></label>
              <input 
                type="time" 
                id="startTime"
                name="startTime"
                value={formData.startTime || ''}
                onChange={handleChange}
                className={`t-input ${errors.startTime ? 't-input-error' : ''}`}
              />
              {errors.startTime && <span className="t-error-msg">{errors.startTime}</span>}
            </div>

            <div className="t-form-group">
              <label htmlFor="endTime">End Time <span className="t-required">*</span></label>
              <input 
                type="time" 
                id="endTime"
                name="endTime"
                value={formData.endTime || ''}
                onChange={handleChange}
                className={`t-input ${errors.endTime ? 't-input-error' : ''}`}
              />
              {errors.endTime && <span className="t-error-msg">{errors.endTime}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Usage Info */}
        <div className="t-form-section">
          <h3>Usage Context</h3>

          <div className="t-form-group">
            <label htmlFor="purpose">Purpose of Booking <span className="t-required">*</span></label>
            <input 
              type="text" 
              id="purpose"
              name="purpose"
              value={formData.purpose || ''}
              onChange={handleChange}
              placeholder="e.g., Weekly Team Meeting, Guest Lecture"
              className={`t-input ${errors.purpose ? 't-input-error' : ''}`}
            />
            {errors.purpose && <span className="t-error-msg">{errors.purpose}</span>}
          </div>

          <div className="t-form-group">
            <label htmlFor="expectedAttendees">Expected Attendees <span className="t-required">*</span></label>
            <input 
              type="number" 
              id="expectedAttendees"
              name="expectedAttendees"
              value={formData.expectedAttendees || ''}
              onChange={handleChange}
              min="1"
              placeholder="Number of participants"
              className={`t-input ${errors.expectedAttendees ? 't-input-error' : ''}`}
            />
            {errors.expectedAttendees && <span className="t-error-msg">{errors.expectedAttendees}</span>}
            
            {/* Dynamic visual warning if potential over-capacity */}
            {selectedResource?.capacity && formData.expectedAttendees > parseInt(selectedResource.capacity) && (
              <span className="t-warning-msg">
                ⚠️ Careful: Expected attendees exceed the resource capacity ({selectedResource.capacity}).
              </span>
            )}
          </div>

          <div className="t-form-group">
            <label htmlFor="notes">Additional Notes / Special Requests</label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Require AV setup, extra chairs, etc."
              rows="3"
              className="t-input t-textarea"
            ></textarea>
          </div>
        </div>

        <div className="t-form-actions">
          {onCancel && (
            <button type="button" className="t-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="t-btn-submit" 
            disabled={conflictInfo?.hasConflict}
          >
            {mode === 'add' ? 'Submit Booking Request' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default T_BookingForm;
