import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './I_AdminResourcesPage.css';

// Import components
import I_ResourceSearch from '../../components/I_facilities/I_ResourceSearch';
import I_ResourceTable from '../../components/I_facilities/I_ResourceTable';
import I_resourceService from '../../services/I_resourceService';

const I_AdminResourcesPage = () => {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // Status toggle simulated processing state
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await I_resourceService.getAllResources();
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error("Failed to fetch LIVE core resources", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Handle Search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredResources(resources);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = resources.filter(res =>
      res.name.toLowerCase().includes(term) ||
      res.type.toLowerCase().includes(term) ||
      res.location.toLowerCase().includes(term)
    );
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  // Action Handlers
  const handleView = (resource) => {
    navigate(`/facilities/${resource.id}`);
  };

  const handleEdit = (resource) => {
    navigate(`/facilities/admin/edit/${resource.id}`);
  };

  const handleDeleteRequest = (resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsProcessing(true);
    try {
      await I_resourceService.deleteResource(resourceToDelete.id);

      const newResources = resources.filter(r => r.id !== resourceToDelete.id);
      setResources(newResources);
      setDeleteModalOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const handleToggleStatus = async (resource) => {
    setIsProcessing(true);
    try {
      const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
      await I_resourceService.updateResourceStatus(resource.id, newStatus);
      
      const updatedResources = resources.map(r =>
        r.id === resource.id ? { ...r, status: newStatus } : r
      );

      setResources(updatedResources);
    } catch (error) {
      console.error("Status toggle failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="admin-resources-page">
      <div className="adm-header">
        <div className="adm-header-left">
          <h1>Manage Resources</h1>
          <p>Admin panel to add, edit, remove, and manage campus facilities.</p>
        </div>
        <div className="adm-header-right">
          <button className="adm-btn-add" onClick={() => navigate('/facilities/admin/new')}>
            <span className="adm-icon-add">+</span> Add New Resource
          </button>
        </div>
      </div>

      <div className="adm-controls">
        <div className="adm-search-box">
          <I_ResourceSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {/* We use pills here for quick visual metrics */}
        <div className="adm-quick-stats">
          <span className="adm-stat-pill">Total: {resources.length}</span>
          <span className="adm-stat-pill adm-stat-active">Active: {resources.filter(r => r.status === 'ACTIVE').length}</span>
        </div>
      </div>

      <div className={`adm-table-wrapper ${isProcessing ? 'adm-processing' : ''}`}>
        {loading ? (
          <div className="adm-loading">
            <div className="adm-spinner"></div>
            <p>Loading catalog data...</p>
          </div>
        ) : (
          <I_ResourceTable
            resources={filteredResources}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && resourceToDelete && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-icon">⚠️</div>
            <h3>Delete Resource</h3>
            <p>Are you sure you want to completely remove <strong>{resourceToDelete.name}</strong> from the catalog? This action cannot be undone and will permanently cancel any future bookings tied to it.</p>

            <div className="adm-modal-actions">
              <button
                className="adm-btn adm-btn-cancel"
                onClick={cancelDelete}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={confirmDelete}
                disabled={isProcessing}
              >
                {isProcessing ? 'Deleting...' : 'Yes, Delete Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default I_AdminResourcesPage;
