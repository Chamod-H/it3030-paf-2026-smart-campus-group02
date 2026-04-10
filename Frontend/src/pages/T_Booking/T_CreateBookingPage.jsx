import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './T_CreateBookingPage.css';
import T_BookingForm from '../../components/T_booking/T_BookingForm';
import T_bookingService from '../../services/T_bookingService';
import I_resourceService from '../../services/I_resourceService';

/**
 * The dedicated page for students/staff to initialize a new booking request.
 */
const T_CreateBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If a user clicked "Book Now" from a specific facility page, we physically auto-populate it
  const queryParams = new URLSearchParams(location.search);
  const initialResourceId = queryParams.get('resourceId') || '';

  const [formData, setFormData] = useState({
    resourceId: initialResourceId,
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [conflictInfo, setConflictInfo] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  // Fetch resources from the database on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await I_resourceService.getAllResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setResourcesLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Real conflict check against the backend whenever key scheduling fields change
  useEffect(() => {
    const checkConflict = async () => {
      if (!formData.resourceId || !formData.bookingDate || !formData.startTime || !formData.endTime) {
        setConflictInfo(null);
        return;
      }
      try {
        const result = await T_bookingService.checkBookingConflict({
          resourceId: formData.resourceId,
          date: formData.bookingDate,
          startTime: formData.startTime,
          endTime: formData.endTime
        });
        if (result?.conflict) {
          setConflictInfo({ hasConflict: true, message: result.message || 'This time slot is already booked. Please choose another.' });
        } else {
          setConflictInfo(null);
        }
      } catch {
        // If conflict check fails, don't block the user — let backend validate on submit
        setConflictInfo(null);
      }
    };
    checkConflict();
  }, [formData.resourceId, formData.bookingDate, formData.startTime, formData.endTime]);

  const validateLocalForm = () => {
    const newErrs = {};
    if (!formData.resourceId) newErrs.resourceId = 'Please select a specific facility structure.';
    if (!formData.bookingDate) newErrs.bookingDate = 'A target date is explicitly required.';
    if (!formData.startTime) newErrs.startTime = 'Please define a start time.';
    if (!formData.endTime) newErrs.endTime = 'Please define an exact end time.';
    if (!formData.purpose.trim()) newErrs.purpose = 'You must explicitly state the core purpose.';
    if (!formData.expectedAttendees || formData.expectedAttendees < 1) newErrs.expectedAttendees = 'A minimum of 1 attendee is technically required.';

    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleBookingSubmit = async () => {
    setSubmitStatus({ type: '', message: '' });

    if (!validateLocalForm()) {
      setSubmitStatus({ type: 'error', message: 'Please correct the highlighted form errors before routing submission.' });
      return;
    }

    if (conflictInfo?.hasConflict) {
      setSubmitStatus({ type: 'error', message: 'System cannot physically submit a booking request that actively conflicts with locked system schedules.' });
      return;
    }

    try {
      // Map form fields to match the backend Booking model
      const payload = {
        resourceId: formData.resourceId,
        date: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
        notes: formData.notes,
      };
      await T_bookingService.createBooking(payload);
      setSubmitStatus({ type: 'success', message: 'Your booking has been successfully submitted and is currently PENDING administrative approval.' });
      
      setTimeout(() => {
        navigate('/bookings/my');
      }, 2500);
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to securely transmit the booking request to the backend.' });
    }
  };

  return (
    <div className="t-create-booking-page">
      <div className="t-cbp-header">
        <h1>Request Facility Booking</h1>
        <p>Complete the form logic completely below to securely request localized access to campus resources.</p>
      </div>

      {submitStatus.message && (
        <div className={`t-cbp-alert t-cbp-alert-${submitStatus.type}`}>
          {submitStatus.type === 'success' ? '✅ ' : '❌ '}
          {submitStatus.message}
        </div>
      )}

      <div className="t-cbp-form-container">
        {/* Calling the heavily-reusable base React component logic! */}
        <T_BookingForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleBookingSubmit}
          onCancel={() => navigate('/bookings')}
          errors={errors}
          resources={resources}
          resourcesLoading={resourcesLoading}
          conflictInfo={conflictInfo}
          mode="add"
        />
      </div>
    </div>
  );
};

export default T_CreateBookingPage;
