import React from 'react';
import './I_ResourceForm.css';

const I_ResourceForm = ({ 
  formData = {}, 
  setFormData, 
  onSubmit, 
  onCancel,
  mode = 'add', 
  errors = {} 
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    if (setFormData) {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && setFormData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  const isEdit = mode === 'edit';

  return (
    <div className="resource-form-container">
      <div className="rf-form-wrapper">
        <div className="rf-form-header">
          <h2>{isEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
          <p>{isEdit ? 'Update details for the selected resource.' : 'Fill in the details below to add a new resource to the catalog.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="rf-main-form">
          {/* General Information */}
          <div className="rf-section">
            <h3 className="rf-section-title">General Information</h3>
            
            <div className="rf-form-row">
              <div className="rf-form-group rf-flex-2">
                <label htmlFor="name">Resource Name <span className="rf-required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={`rf-input ${errors.name ? 'rf-input-error' : ''}`}
                  placeholder="e.g. Advanced Physics Lab"
                />
                {errors.name && <span className="rf-error-text">{errors.name}</span>}
              </div>

              <div className="rf-form-group rf-flex-1">
                <label htmlFor="type">Resource Type <span className="rf-required">*</span></label>
                <select
                  id="type"
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  className={`rf-input ${errors.type ? 'rf-input-error' : ''}`}
                >
                  <option value="">Select Type</option>
                  <option value="Lecture hall">Lecture Hall</option>
                  <option value="Lab">Laboratory</option>
                  <option value="Meeting room">Meeting Room</option>
                  <option value="Equipment">Equipment</option>
                </select>
                {errors.type && <span className="rf-error-text">{errors.type}</span>}
              </div>
            </div>

            <div className="rf-form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={`rf-input rf-textarea ${errors.description ? 'rf-input-error' : ''}`}
                placeholder="Provide details about the resource capabilities..."
                rows="4"
              ></textarea>
              {errors.description && <span className="rf-error-text">{errors.description}</span>}
            </div>
          </div>

          {/* Details & Location */}
          <div className="rf-section">
            <h3 className="rf-section-title">Details & Location</h3>
            
            <div className="rf-form-row">
              <div className="rf-form-group rf-flex-1">
                {formData.type === 'Equipment' ? (
                  <>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity ?? ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (setFormData) setFormData(prev => ({ ...prev, quantity: val }));
                      }}
                      onFocus={(e) => e.target.select()}
                      className={`rf-input ${errors.quantity ? 'rf-input-error' : ''}`}
                      placeholder="e.g. 10"
                    />
                    {errors.quantity && <span className="rf-error-text">{errors.quantity}</span>}
                  </>
                ) : (
                  <>
                    <label htmlFor="capacity">Capacity</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity ?? ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (setFormData) setFormData(prev => ({ ...prev, capacity: val }));
                      }}
                      onFocus={(e) => e.target.select()}
                      className={`rf-input ${errors.capacity ? 'rf-input-error' : ''}`}
                      placeholder="e.g. 50"
                    />
                    {errors.capacity && <span className="rf-error-text">{errors.capacity}</span>}
                  </>
                )}
              </div>

              <div className="rf-form-group rf-flex-2">
                <label htmlFor="location">Location <span className="rf-required">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className={`rf-input ${errors.location ? 'rf-input-error' : ''}`}
                  placeholder="e.g. Block C, Level 2, Room 204"
                />
                {errors.location && <span className="rf-error-text">{errors.location}</span>}
              </div>
            </div>
          </div>

          {/* Availability & Status */}
          <div className="rf-section">
            <h3 className="rf-section-title">Availability & Setup</h3>
            
            <div className="rf-form-row">
              <div className="rf-form-group rf-flex-1">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || 'ACTIVE'}
                  onChange={handleChange}
                  className={`rf-input ${errors.status ? 'rf-input-error' : ''}`}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
                {errors.status && <span className="rf-error-text">{errors.status}</span>}
              </div>

              <div className="rf-form-group rf-flex-2">
                <label htmlFor="availabilitySummary">Availability Summary</label>
                <input
                  type="text"
                  id="availabilitySummary"
                  name="availabilitySummary"
                  value={formData.availabilitySummary || ''}
                  onChange={handleChange}
                  className={`rf-input ${errors.availabilitySummary ? 'rf-input-error' : ''}`}
                  placeholder="e.g. Mon-Fri, 08:00 AM - 08:00 PM"
                />
                {errors.availabilitySummary && <span className="rf-error-text">{errors.availabilitySummary}</span>}
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rf-section">
            <h3 className="rf-section-title">Resource Media</h3>
            
            <div className="rf-form-group">
              <label>Resource Image</label>
              <div className="rf-image-upload-area">
                {formData.imageUrl ? (
                  <div className="rf-image-preview">
                    <img src={formData.imageUrl} alt="Preview" />
                    <button 
                      type="button" 
                      className="rf-remove-img"
                      onClick={() => setFormData && setFormData(prev => ({...prev, imageUrl: null, imageFile: null}))}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="rf-upload-placeholder">
                    <span className="rf-upload-icon">📷</span>
                    <p>Drag and drop an image, or click to browse</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="rf-file-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="rf-form-actions">
            <button 
              type="button" 
              className="rf-btn rf-btn-cancel" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rf-btn rf-btn-submit"
            >
              {isEdit ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default I_ResourceForm;
