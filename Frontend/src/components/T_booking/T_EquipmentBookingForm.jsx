import React from 'react';
import './T_BookingForm.css';

/**
 * Reusable form component specifically isolated for Equipment resource booking requests.
 */
const T_EquipmentBookingForm = ({
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
        {conflictInfo?.hasConflict && (
          <div className="t-conflict-alert">
            <span className="t-conflict-icon">⚠️</span>
            <div className="t-conflict-text">
              <strong>Time Slot Unavailable</strong>
              <p>{conflictInfo.message}</p>
            </div>
          </div>
        )}

        {/* Section 1: Equipment & Schedule */}
        <div className="t-form-section">
          <h3>Equipment Details</h3>
          
          <div className="t-form-group">
            <label htmlFor="resourceId">Select Equipment <span className="t-required">*</span></label>
            <select 
              id="resourceId"
              name="resourceId" 
              value={formData.resourceId || ''} 
              onChange={handleChange}
              className={`t-input ${errors.resourceId ? 't-input-error' : ''}`}
            >
              <option value="" disabled>
                {resourcesLoading ? 'Loading equipment...' : '-- Select Equipment --'}
              </option>
              {!resourcesLoading && resources.filter(res => res.type === 'Equipment' && res.status === 'ACTIVE').map(res => (
                <option key={res.id} value={res.id}>
                  {res.name} {res.quantity ? `(In Stock: ${res.quantity})` : ''}
                </option>
              ))}
            </select>
            {errors.resourceId && <span className="t-error-msg">{errors.resourceId}</span>}
            {selectedResource?.status === 'OUT_OF_SERVICE' && (
              <span className="t-warning-msg">Note: This equipment is currently marked as heavily restricted or out of service.</span>
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

          <div className="t-form-row">
            <div className="t-form-group">
              <label htmlFor="startTime">Pickup Time <span className="t-required">*</span></label>
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
              <label htmlFor="endTime">Return Time <span className="t-required">*</span></label>
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
              placeholder="e.g., Video Shooting, Tech Presentation"
              className={`t-input ${errors.purpose ? 't-input-error' : ''}`}
            />
            {errors.purpose && <span className="t-error-msg">{errors.purpose}</span>}
          </div>

          {/* This represents the specific request: switching from attendees to Quantity */}
          <div className="t-form-group">
            <label htmlFor="quantity">Quantity <span className="t-required">*</span></label>
            <input 
              type="number" 
              id="quantity"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
              min="1"
              placeholder="Amount of equipment"
              className={`t-input ${errors.quantity ? 't-input-error' : ''}`}
            />
            {errors.quantity && <span className="t-error-msg">{errors.quantity}</span>}
            
            {selectedResource?.quantity && parseInt(formData.quantity) > parseInt(selectedResource.quantity) && (
              <span className="t-warning-msg">
                ⚠️ Careful: Requested quantity exceeds the known stock ({selectedResource.quantity}).
              </span>
            )}
          </div>

          <div className="t-form-group">
            <label htmlFor="notes">Additional Notes / Accessories</label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Require extra batteries, special lenses, etc."
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
            {mode === 'add' ? 'Submit Equipment Request' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default T_EquipmentBookingForm;
