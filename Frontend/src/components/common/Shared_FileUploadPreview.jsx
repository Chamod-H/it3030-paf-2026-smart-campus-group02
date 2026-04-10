import React, { useEffect, useState } from 'react';
import './Shared_FileUploadPreview.css';

/**
 * Reusable File Upload Preview Component
 * Renders an array of pending attachments or existing documents as a visual grid.
 * Capable of handling raw Browser API File objects (via object URLs) or direct string URLs.
 * 
 * @param {Array<File|string>} files - The list of files to iterate and preview
 * @param {function} onRemove - Callback triggered with the targeted array 'index' to delete
 * @param {boolean} editable - Governs whether the destructive 'remove' mechanism renders
 */
const Shared_FileUploadPreview = ({ 
  files = [], 
  onRemove, 
  editable = true 
}) => {
  
  if (!files || files.length === 0) return null;

  // Utility to convert raw browser bytes into a human-readable size block
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return null;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Utility to check MIME types or URL endings to infer thumbnail generation
  const isImageFile = (file) => {
    if (file && file.type) return file.type.startsWith('image/');
    if (typeof file === 'string') {
      return file.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
    }
    return false;
  };

  // Safe object URL generator that falls back to exact text for standard links
  const getThumbnailSource = (file) => {
    if (typeof file === 'string') return file;
    if (file instanceof File || file instanceof Blob) {
      try { return URL.createObjectURL(file); } 
      catch (e) { return ''; }
    }
    return '';
  };

  return (
    <div className="shared-file-uploader-grid">
      {files.map((file, index) => {
        const isImg = isImageFile(file);
        
        // Extract basic metadata depending on whether it's a File object or raw string
        const fileName = file.name || (typeof file === 'string' ? file.split('/').pop() : `Attachment ${index + 1}`);
        const fileSize = formatBytes(file.size);
        const sourceUrl = getThumbnailSource(file);

        return (
          <div key={`${fileName}-${index}`} className="shared-file-card">
            
            <div className={`shared-file-thumb ${isImg ? 'image-thumb' : 'doc-thumb'}`}>
              {isImg && sourceUrl ? (
                <img src={sourceUrl} alt={fileName} className="shared-file-img" />
              ) : (
                <div className="shared-file-doc-icon">📎</div>
              )}
            </div>
            
            <div className="shared-file-meta">
              <span className="shared-file-name" title={fileName}>
                {fileName}
              </span>
              {fileSize && (
                <span className="shared-file-size">{fileSize}</span>
              )}
            </div>

            {editable && onRemove && (
              <button 
                type="button" 
                className="shared-file-remove-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(index);
                }}
                aria-label={`Remove ${fileName}`}
                title="Remove attachment"
              >
                ✕
              </button>
            )}
            
          </div>
        );
      })}
    </div>
  );
};

export default Shared_FileUploadPreview;
