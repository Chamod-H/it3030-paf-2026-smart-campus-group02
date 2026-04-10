import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './I_EditResourcePage.css';
import I_ResourceForm from '../../components/I_facilities/I_ResourceForm';
import { validateResourceForm } from '../../validation/I_resourceValidation';
import I_resourceService from '../../services/I_resourceService';

const I_EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', type: '', description: '', capacity: '', quantity: '',
    location: '', status: 'ACTIVE', availabilitySummary: '',
    imageFile: null, imageUrl: null
  });

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      try {
        const data = await I_resourceService.getResourceById(id);
        if (!data) throw new Error("Resource not found or may have been deleted.");

        setFormData({
          name: data.name || '',
          type: data.type || '',
          description: data.description || '',
          capacity: data.capacity != null && data.capacity !== 'N/A' ? String(data.capacity) : '',
          quantity: data.quantity != null && data.quantity !== 'N/A' ? String(data.quantity) : '',
          location: data.location || '',
          status: data.status || 'ACTIVE',
          availabilitySummary: data.availabilitySummary || '',
          imageUrl: data.imageUrl || null,
          imageFile: null
        });
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const validateForm = () => {
    const newErrors = validateResourceForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        capacity: formData.type !== 'Equipment' && formData.capacity ? parseInt(formData.capacity, 10) : null,
        quantity: formData.type === 'Equipment' && formData.quantity ? parseInt(formData.quantity, 10) : null,
        location: formData.location,
        status: formData.status,
        availabilitySummary: formData.availabilitySummary,
        imageUrl: formData.imageUrl
      };

      await I_resourceService.updateResource(id, payload);
      setSubmitMessage({ type: 'success', text: 'Resource details securely updated!' });

      setTimeout(() => {
        navigate('/admin/facilities');
      }, 1500);

    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to update resource. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  if (loading) {
    return (
      <div className="erp-page-loading">
        <div className="erp-spinner"></div>
        <p>Fetching resource details for edit...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="erp-page-error">
        <h2>Cannot Edit Resource</h2>
        <p>{fetchError}</p>
        <button className="erp-btn-primary" onClick={() => navigate('/admin/facilities')}>
          Return to Admin Panel
        </button>
      </div>
    );
  }

  return (
    <div className="edit-resource-page">
      <div className="erp-admin-notice">
        <span className="erp-admin-icon">⚙️</span>
        <p>Admin Access: Modifying core resource details.</p>
      </div>

      <div className="erp-header">
        <h1>Edit Resource: {formData.name}</h1>
        <p>Update the attributes below. Changes are reflected everywhere immediately.</p>
      </div>

      {submitMessage && (
        <div className={`erp-alert erp-alert-${submitMessage.type}`}>
          {submitMessage.type === 'success' ? '✅ ' : '❌ '}
          {submitMessage.text}
        </div>
      )}

      {isSubmitting && (
        <div className="erp-loading-overlay">
          <div className="erp-spinner"></div>
          <p>Applying changes...</p>
        </div>
      )}

      <div className={`erp-form-area ${isSubmitting ? 'erp-faded' : ''}`}>
        <I_ResourceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="edit"
          errors={errors}
        />
      </div>
    </div>
  );
};

export default I_EditResourcePage;
