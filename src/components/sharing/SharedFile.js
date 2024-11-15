import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SharedFile.css';

const SharedFile = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/files/shared/${fileId}`);
        
        if (!response.ok) {
          throw new Error('File not found or access denied');
        }

        const data = await response.json();
        setFile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  // Record view when component mounts
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch(`/api/files/${fileId}/view`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    if (file) {
      recordView();
    }
  }, [file, fileId]);

  if (loading) {
    return (
      <div className="shared-file-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-file-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-file-container">
      <div className="shared-file-content">
        <h1>{file.name}</h1>
        
        <div className="file-metadata">
          <span>Shared on: {new Date(file.createdAt).toLocaleDateString()}</span>
          {file.tags.length > 0 && (
            <div className="shared-tags">
              {file.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="shared-file-preview">
          {file.type.startsWith('image/') ? (
            <img 
              src={file.url} 
              alt={file.name}
              className="shared-image"
            />
          ) : (
            <video 
              src={file.url}
              controls
              className="shared-video"
              poster={file.thumbnail}
            />
          )}
        </div>

        <div className="download-section">
          <a
            href={`/api/files/${fileId}/download`}
            download={file.name}
            className="download-button"
          >
            Download File
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedFile; 