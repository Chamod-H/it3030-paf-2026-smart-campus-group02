import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './T_CreateBookingPage.css';
import T_EquipmentBookingForm from '../../components/T_booking/T_EquipmentBookingForm';
import T_bookingService from '../../services/T_bookingService';
import I_resourceService from '../../services/I_resourceService';

/**
 * Isolated page specifically assigned for securely initializing new Equipment booking requests.
 */
const T_CreateEquipmentBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialResourceId = queryParams.get('resourceId') || '';

  const [formData, setFormData] = useState({
    resourceId: initialResourceId,
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    quantity: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [conflictInfo, setConflictInfo] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

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
          setConflictInfo({ hasConflict: true, message: result.message || 'This specific equipment is heavily reserved. Please attempt an alternative window.' });
        } else {
          setConflictInfo(null);
        }
      } catch {
        setConflictInfo(null);
      }
    };
    checkConflict();
  }, [formData.resourceId, formData.bookingDate, formData.startTime, formData.endTime]);

  const validateLocalForm = () => {
    const newErrs = {};
    if (!formData.resourceId) newErrs.resourceId = 'Please select requested equipment physically from the menu.';
    if (!formData.bookingDate) newErrs.bookingDate = 'A dedicated target date is explicitly required.';
    if (!formData.startTime) newErrs.startTime = 'Please strictly define a designated pickup time.';
    if (!formData.endTime) newErrs.endTime = 'Please stringently state a confirmed return time limit.';
    if (!formData.purpose.trim()) newErrs.purpose = 'You must directly state a core working purpose.';
    if (!formData.quantity || formData.quantity < 1) {
      newErrs.quantity = 'A distinct baseline volume map of at least 1 is required.';
    } else {
      const selectedResource = resources.find(r => String(r.id) === String(formData.resourceId));
      if (selectedResource?.quantity && parseInt(formData.quantity) > parseInt(selectedResource.quantity)) {
        newErrs.quantity = `Strict Validation Failed: Requested quantity (${formData.quantity}) exceeds available stock (${selectedResource.quantity}).`;
      }
    }

    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleBookingSubmit = async () => {
    setSubmitStatus({ type: '', message: '' });

    if (!validateLocalForm()) {
      setSubmitStatus({ type: 'error', message: 'Please correct strict formatting errors prior to transmission validation.' });
      return;
    }

    if (conflictInfo?.hasConflict) {
      setSubmitStatus({ type: 'error', message: 'System actively prevents executing a physical reservation mapping during locked conflicting system overlaps.' });
      return;
    }

    try {
      const payload = {
        resourceId: formData.resourceId,
        date: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        notes: formData.notes,
        status: 'PENDING'
      };
      await T_bookingService.createBooking(payload);
      setSubmitStatus({ type: 'success', message: 'The specified physical equipment asset requirement is mapped and PENDING institutional review.' });
      
      setTimeout(() => {
        navigate('/bookings/my');
      }, 2500);
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err?.response?.data?.message || 'Server violently blocked request packet payload mapping.' });
    }
  };

  return (
    <div className="t-create-booking-page">
      <div className="t-cbp-header">
        <h1>Equipment Reservations</h1>
        <p>Complete structural tracking components beneath to actively lease specialized institutional physical technology arrays.</p>
      </div>

      {submitStatus.message && (
        <div className={`t-cbp-alert t-cbp-alert-${submitStatus.type}`}>
          {submitStatus.type === 'success' ? '✅ ' : '❌ '}
          {submitStatus.message}
        </div>
      )}

      <div className="t-cbp-form-container">
        <T_EquipmentBookingForm 
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

export default T_CreateEquipmentBookingPage;
