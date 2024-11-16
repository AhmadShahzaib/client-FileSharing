import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import FileUpload from './FileUpload';
import FileList from './FileList';
import FileStats from './FileStats';
import './Dashboard.css';
import { API_URL } from '../../config/api';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/files`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);

    try {
      await fetch(`${API_URL}/api/files/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fileId: reorderedItem._id,
          newPosition: result.destination.index
        })
      });
    } catch (error) {
      console.error('Error updating file order:', error);
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>File Manager</h1>
        <button 
          className="logout-button"
          onClick={async () => {
            await fetch(`${API_URL}/api/auth/logout`, {
              method: 'POST',
              credentials: 'include'
            });
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="main-section">
          <FileUpload onFileUpload={fetchFiles} />
          <DragDropContext onDragEnd={handleDragEnd}>
            <FileList 
              files={files} 
              onFileSelect={setSelectedFile}
              onFileUpdate={fetchFiles}
            />
          </DragDropContext>
        </div>
        
        <div className="side-section">
          {selectedFile && (
            <FileStats 
              file={selectedFile}
              onUpdate={fetchFiles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 