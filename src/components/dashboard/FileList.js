import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { API_URL } from '../../config/api';
import './FileList.css';

const FileList = ({ files, onFileSelect, onFileUpdate }) => {
  const [editingTags, setEditingTags] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const handleTagSubmit = async (fileId) => {
    try {
      const response = await fetch(`${API_URL}/api/files/${fileId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tags: tagInput.split(',').map(tag => tag.trim())
        })
      });

      if (response.ok) {
        setEditingTags(null);
        onFileUpdate();
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(`${API_URL}/api/files/${fileId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          onFileUpdate();
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const generateShareLink = (fileId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${fileId}`;
  };

  const copyShareLink = (fileId) => {
    const link = generateShareLink(fileId);
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  return (
    <Droppable droppableId="file-list">
      {(provided) => (
        <div
          className="file-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {files.map((file, index) => (
            <Draggable key={file._id} draggableId={file._id} index={index}>
              {(provided) => (
                <div
                  className="file-item"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  onClick={() => onFileSelect(file)}
                >
                  <div className="file-preview">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} />
                    ) : (
                      <video src={file.url} />
                    )}
                  </div>
                  
                  <div className="file-info">
                    <h3>{file.name}</h3>
                    <div className="file-tags">
                      {editingTags === file.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleTagSubmit(file._id);
                          }}
                        >
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Enter tags, separated by commas"
                          />
                          <button type="submit">Save</button>
                        </form>
                      ) : (
                        <>
                          {file.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                          <button
                            className="edit-tags-btn"
                            onClick={() => {
                              setEditingTags(file.id);
                              setTagInput(file.tags.join(', '));
                            }}
                          >
                            Edit Tags
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      className="share-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyShareLink(file._id);
                      }}
                    >
                      Share
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FileList; 