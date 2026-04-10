import React from 'react';
import { FiEye, FiEdit2, FiPauseCircle, FiPlayCircle, FiTrash2 } from 'react-icons/fi';
import './I_ResourceTable.css';

const I_ResourceTable = ({ resources = [], onView, onEdit, onDelete, onToggleStatus }) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="resource-table-empty">
        <div className="rt-empty-icon">📊</div>
        <h3>No resources found</h3>
        <p>There are no resources to manage at the moment.</p>
      </div>
    );
  }

  return (
    <div className="resource-table-container">
      <table className="resource-table">
        <thead>
          <tr>
            <th>Resource Name</th>
            <th>Type</th>
            <th>Capacity / Qty</th>
            <th>Location</th>
            <th>Status</th>
            <th>Availability</th>
            <th className="rt-actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id || resource._id || Math.random().toString()}>
              <td className="rt-name">
                <div className="rt-name-cell">
                  {resource.imageUrl ? (
                    <img src={resource.imageUrl} alt="" className="rt-thumbnail" />
                  ) : (
                    <div className="rt-thumbnail rt-thumbnail-placeholder"></div>
                  )}
                  <span>{resource.name}</span>
                </div>
              </td>
              <td><span className="rt-type-badge">{resource.type}</span></td>
              <td>{resource.type === 'Equipment' ? (resource.quantity ?? 'N/A') : (resource.capacity ?? 'N/A')}</td>
              <td>{resource.location}</td>
              <td>
                <span className={`rt-status-badge ${resource.status === 'ACTIVE' ? 'rt-status-active' : 'rt-status-inactive'}`}>
                  {resource.status ? resource.status.replace(/_/g, ' ') : 'UNKNOWN'}
                </span>
              </td>
              <td>{resource.availabilitySummary || 'Check availability'}</td>
              <td className="rt-actions-cell">
                <div className="rt-action-buttons">
                  <button 
                    title="View Details"
                    className="rt-btn rt-btn-view"
                    onClick={() => onView && onView(resource)}
                  >
                    <FiEye />
                  </button>
                  <button 
                    title="Edit Resource"
                    className="rt-btn rt-btn-edit"
                    onClick={() => onEdit && onEdit(resource)}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    title={resource.status === 'ACTIVE' ? 'Mark Out of Service' : 'Mark Active'}
                    className={`rt-btn rt-btn-toggle ${resource.status === 'ACTIVE' ? 'rt-toggle-off' : 'rt-toggle-on'}`}
                    onClick={() => onToggleStatus && onToggleStatus(resource)}
                  >
                    {resource.status === 'ACTIVE' ? <FiPauseCircle /> : <FiPlayCircle />}
                  </button>
                  <button 
                    title="Delete Resource"
                    className="rt-btn rt-btn-delete"
                    onClick={() => onDelete && onDelete(resource)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default I_ResourceTable;
