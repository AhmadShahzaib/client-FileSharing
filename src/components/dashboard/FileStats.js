import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import './FileList.css';

const FileStats = ({ file, onUpdate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [file._id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/files/${file._id}/stats`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-loading">Loading stats...</div>;
  }

  return (
    <div className="file-stats">
      <h2>File Statistics</h2>
      
      <div className="stats-content">
        <div className="stat-item">
          <label>Uploaded:</label>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="stat-item">
          <label>Size:</label>
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>

        <div className="stat-item">
          <label>Views:</label>
          <span>{stats?.views || 0}</span>
        </div>

        <div className="stat-item">
          <label>Last Viewed:</label>
          <span>
            {stats?.lastViewed 
              ? new Date(stats.lastViewed).toLocaleDateString()
              : 'Never'}
          </span>
        </div>

        <div className="stat-item">
          <label>Share Count:</label>
          <span>{stats?.shareCount || 0}</span>
        </div>
      </div>

      <div className="file-preview-large">
        {file.type.startsWith('image/') ? (
          <img src={file.url} alt={file.name} />
        ) : (
          <video src={file.url} controls />
        )}
      </div>
    </div>
  );
};

export default FileStats; 