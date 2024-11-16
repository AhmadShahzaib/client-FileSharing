import { useState, useRef } from 'react';
import { API_URL } from '../../config/api';
import './Dashboard.css';

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    
    // Validate file type
    if (!file.type.match('image.*') && !file.type.match('video.*')) {
      setError('Please upload only image or video files');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(0);
      setError('');
      onFileUpload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="file-upload">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/*,video/*"
        />
        <div className="upload-message">
          <i className="upload-icon">📁</i>
          <p>Drag and drop files here or click to select</p>
          <span className="upload-hint">Supports images and videos</span>
        </div>
      </div>
      
      {uploadProgress > 0 && (
        <div className="upload-progress">
          <div 
            className="progress-bar"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default FileUpload; 