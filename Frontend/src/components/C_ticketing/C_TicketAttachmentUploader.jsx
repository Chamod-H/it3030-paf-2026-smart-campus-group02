import React, { useRef, useState } from 'react';
import './C_TicketAttachmentUploader.css';

/**
 * Reusable Drag-and-Drop Image Uploader.
 */
const C_TicketAttachmentUploader = ({
  files = [],
  setFiles,
  maxFiles = 3,
  maxSizeMB = 5,
  error
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  const MAX_BYTES = maxSizeMB * 1024 * 1024;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processIncomingFiles(Array.from(e.target.files));
      e.target.value = null; 
    }
  };

  const processIncomingFiles = (incomingFiles) => {
    setLocalError('');
    
    // Valiate types
    const imageFiles = incomingFiles.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) setLocalError('Only image files (JPG, PNG) are allowed.');
      return isValid;
    });

    // Validate sizes
    const sizedFiles = imageFiles.filter(file => {
      const isValidSize = file.size <= MAX_BYTES;
      if (!isValidSize) setLocalError(`Files must be smaller than ${maxSizeMB}MB.`);
      return isValidSize;
    });

    setFiles(prev => {
      const currentCount = prev.length || 0;
      const spaceLeft = maxFiles - currentCount;
      
      if (spaceLeft <= 0) {
        setLocalError(`Maximum limit of ${maxFiles} files reached.`);
        return prev;
      }
      
      const filesToAdd = sizedFiles.slice(0, spaceLeft);
      if (sizedFiles.length > spaceLeft) {
         setLocalError(`Only ${spaceLeft} more slot(s) available.`);
      }

      return [...prev, ...filesToAdd];
    });
  };

  const removeFile = (index) => {
    setLocalError('');
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const displayError = localError || error;

  return (
    <div className="c-ticket-attachment-uploader">
      <div 
        className={`c-tau-dropzone ${dragActive ? 'drag-active' : ''} ${error ? 'c-tau-error-border' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="c-tau-content">
          <span className="c-tau-icon">📸</span>
          <p>Drag & drop images here or <button type="button" onClick={triggerFileSelect} className="c-tau-trigger">Browse Files</button></p>
          <div className="c-tau-limit">Max size: {maxSizeMB}MB per file • Valid formats: JPG, PNG • Count: {files.length}/{maxFiles}</div>
        </div>
      </div>
      
      {displayError && <span className="c-tau-error-text">⚠️ Error: {displayError}</span>}

      {files.length > 0 && (
        <div className="c-tau-preview-grid">
          {files.map((file, idx) => (
            <div key={idx} className="c-tau-preview-card">
              <img src={URL.createObjectURL(file)} alt={`attachment-${idx}`} />
              <button type="button" onClick={() => removeFile(idx)} className="c-tau-remove-btn" title="Remove">×</button>
              <div className="c-tau-preview-meta">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default C_TicketAttachmentUploader;
