import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './I_AddResourcePage.css';
import I_ResourceForm from '../../components/I_facilities/I_ResourceForm';
import { validateResourceForm } from '../../validation/I_resourceValidation';
import I_resourceService from '../../services/I_resourceService';

const I_AddResourcePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    capacity: '',
    quantity: '',
    location: '',
    status: 'ACTIVE',
    availabilitySummary: '',
    imageFile: null,
    imageUrl: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

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

      // Direct integration to server-side mapping implementation!
      await I_resourceService.createResource(payload);

      setSubmitMessage({ type: 'success', text: 'Resource successfully added to the catalog!' });

      // Redirect to admin list after a brief delay
      setTimeout(() => {
        navigate('/admin/facilities');
      }, 1500);

    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to add resource. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  return (
    <div className="add-resource-page">
      <div className="arp-admin-notice">
        <span className="arp-admin-icon">🛡️</span>
        <p>Admin Access: You are creating a new facility resource.</p>
      </div>

      <div className="arp-header">
        <h1>Add New Resource</h1>
        <p>This resource will become immediately available in the catalog once created.</p>
      </div>

      {submitMessage && (
        <div className={`arp-alert arp-alert-${submitMessage.type}`}>
          {submitMessage.type === 'success' ? '✅ ' : '❌ '}
          {submitMessage.text}
        </div>
      )}

      {isSubmitting && (
        <div className="arp-loading-overlay">
          <div className="arp-spinner"></div>
          <p>Saving resource...</p>
        </div>
      )}

      <div className={`arp-form-area ${isSubmitting ? 'arp-faded' : ''}`}>
        <I_ResourceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="add"
          errors={errors}
        />
      </div>
    </div>
  );
};

export default I_AddResourcePage;
