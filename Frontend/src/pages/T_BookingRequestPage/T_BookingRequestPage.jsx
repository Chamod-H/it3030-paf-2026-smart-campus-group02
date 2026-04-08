import React, { useState, useEffect } from 'react';
import './T_BookingRequestPage.css';

const MOCK_RESOURCES = [
  { id: '1', name: 'Boardroom A' },
  { id: '2', name: 'Conference Hall B' },
  { id: '3', name: 'Auditorium' },
  { id: '4', name: 'Projector Room 1' },
];

const BookingRequestPage = () => {
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: ''
  });

  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    const { resourceId, bookingDate, startTime, endTime } = formData;
    
    // Reset if any crucial field is missing
    if (!resourceId || !bookingDate || !startTime || !endTime) {
      setAvailability(null);
      return;
    }

    // Invalid time range
    if (startTime >= endTime) {
      setAvailability(null);
      return;
    }

    setAvailability('checking');
    
    // Simulate API call for availability
    const timer = setTimeout(() => {
      let isAvailable = true;
      
      // MOCK LOGIC for demo purposes:
      // If user books between 13:00 to 14:00 (1 PM - 2 PM), show it as unavailable
      const startHour = parseInt(startTime.split(':')[0], 10);
      if (startHour === 13 || startHour === 14) {
        isAvailable = false;
      }

      setAvailability(isAvailable ? 'available' : 'unavailable');
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.resourceId, formData.bookingDate, formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the specific error when the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.resourceId) newErrors.resourceId = 'Resource is required';
    if (!formData.bookingDate) newErrors.bookingDate = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.attendees || formData.attendees < 1) newErrors.attendees = 'At least 1 attendee is required';

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && availability === 'available') {
      // Future: Connect to Spring Boot backend API here
      console.log('Form submitted successfully:', formData);
      alert('Your booking request has been submitted successfully! (Mock)');
      handleReset();
    } else if (availability !== 'available') {
      alert('Please select an available time slot.');
    }
  };

  const handleReset = () => {
    setFormData({
      resourceId: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: ''
    });
    setErrors({});
  };

  return (
    <div className="T_pageContainer">
      <div className="T_formCard">
        <div className="T_cardHeader">
          <h1 className="T_pageTitle">Request a Booking</h1>
          <p className="T_pageSubtitle">Reserve a campus resource for your event or meeting.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="T_bookingForm">
          <div className="T_formRow">
            <div className="T_inputGroup">
              <label htmlFor="resourceId" className="T_label">Resource</label>
              <select
                id="resourceId"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                className={`T_select ${errors.resourceId ? 'T_inputError' : ''}`}
              >
                <option value="">Select a resource...</option>
                {MOCK_RESOURCES.map((res) => (
                  <option key={res.id} value={res.id}>{res.name}</option>
                ))}
              </select>
              {errors.resourceId && <span className="T_errorText">{errors.resourceId}</span>}
            </div>

            <div className="T_inputGroup">
              <label htmlFor="bookingDate" className="T_label">Booking Date</label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                className={`T_input ${errors.bookingDate ? 'T_inputError' : ''}`}
              />
              {errors.bookingDate && <span className="T_errorText">{errors.bookingDate}</span>}
            </div>
          </div>

          <div className="T_formRow">
            <div className="T_inputGroup">
              <label htmlFor="startTime" className="T_label">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`T_input ${errors.startTime ? 'T_inputError' : ''}`}
              />
              {errors.startTime && <span className="T_errorText">{errors.startTime}</span>}
            </div>

            <div className="T_inputGroup">
              <label htmlFor="endTime" className="T_label">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`T_input ${errors.endTime ? 'T_inputError' : ''}`}
              />
              {errors.endTime && <span className="T_errorText">{errors.endTime}</span>}
            </div>
          </div>

          <div className="T_inputGroup">
            <label htmlFor="purpose" className="T_label">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              placeholder="Briefly describe the purpose of this booking..."
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              className={`T_textarea ${errors.purpose ? 'T_inputError' : ''}`}
            />
            {errors.purpose && <span className="T_errorText">{errors.purpose}</span>}
          </div>

          <div className="T_inputGroup">
            <label htmlFor="attendees" className="T_label">Expected Attendees</label>
            <input
              type="number"
              id="attendees"
              name="attendees"
              min="1"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="e.g. 10"
              className={`T_input ${errors.attendees ? 'T_inputError' : ''}`}
            />
            {errors.attendees && <span className="T_errorText">{errors.attendees}</span>}
          </div>

          {availability && (
            <div className={`T_availabilityStatus T_status_${availability}`}>
              {availability === 'checking' && '⏳ Checking availability...'}
              {availability === 'available' && '✅ Resource is available for selected time.'}
              {availability === 'unavailable' && '❌ Resource is currently booked for this time.'}
            </div>
          )}

          <div className="T_buttonGroup">
            <button type="button" onClick={handleReset} className="T_btn T_btnOutline">
              Reset
            </button>
            <button 
              type="submit" 
              className="T_btn T_btnPrimary"
              disabled={availability === 'checking' || availability === 'unavailable'}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestPage;
