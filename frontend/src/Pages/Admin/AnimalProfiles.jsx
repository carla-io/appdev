import React, { useEffect, useState } from 'react';
import { PlusCircle, Edit3, Eye, X, Save, Camera, Upload } from 'lucide-react';
import axios from 'axios';
import '../CSS/AnimalProfile.css'; // Assuming you have a CSS file for styling

const AnimalProfiles = ({ setShowAnimalModal }) => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAnimal, setEditAnimal] = useState({});
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    status: 'healthy',
    owner: '',
    photo: ''
  });

  // Photo preview states
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [newPhotoPreview, setNewPhotoPreview] = useState('');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/animal/getAll');
        if (response.data.success) {
          setAnimals(response.data.animals);
        }
      } catch (error) {
        console.error('Error fetching animals:', error.message);
      }
    };

    fetchAnimals();
  }, []);

  // Handle photo file selection
  const handlePhotoChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (isEdit) {
          setEditAnimal({ ...editAnimal, photo: base64String });
          setEditPhotoPreview(base64String);
        } else {
          setNewAnimal({ ...newAnimal, photo: base64String });
          setNewPhotoPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo
  const removePhoto = (isEdit = false) => {
    if (isEdit) {
      setEditAnimal({ ...editAnimal, photo: '' });
      setEditPhotoPreview('');
    } else {
      setNewAnimal({ ...newAnimal, photo: '' });
      setNewPhotoPreview('');
    }
  };

  const handleViewDetails = (animal) => {
    setSelectedAnimal(animal);
    setShowDetailModal(true);
  };

  const handleEdit = (animal) => {
    setSelectedAnimal(animal);
    setEditAnimal({ ...animal });
    setEditPhotoPreview(animal.photo || '');
    setShowEditModal(true);
  };

  const handleUpdateAnimal = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/animal/update/${editAnimal._id}`, editAnimal);
      if (response.data.success) {
        const updatedAnimals = animals.map(animal => 
          animal._id === editAnimal._id ? response.data.animal : animal
        );
        setAnimals(updatedAnimals);
        setShowEditModal(false);
        setEditAnimal({});
        setEditPhotoPreview('');
      }
    } catch (error) {
      console.error('Error updating animal:', error);
    }
  };

  const handleAddAnimal = async () => {
    try {
      const response = await axios.post('http://localhost:5000/animal/add', newAnimal);
      if (response.data.success) {
        setAnimals(prev => [...prev, response.data.animal]);
        setShowAddModal(false);
        setNewAnimal({ name: '', species: '', breed: '', age: '', status: 'healthy', owner: '', photo: '' });
        setNewPhotoPreview('');
      }
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedAnimal(null);
    setEditAnimal({});
    setEditPhotoPreview('');
    setNewPhotoPreview('');
  };

  return (
    <div className="animal-profiles-container">
      {/* Page Header */}
      <div className="animal-profiles-header">
        <h1 className="animal-profiles-title">Animal Profiles</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="add-animal-btn"
        >
          <PlusCircle />
          Add Animal
        </button>
      </div>

      {/* Animals Grid */}
      <div className="animals-grid">
        {animals.map(animal => (
          <div key={animal._id} className="animal-card">
            {/* Animal Photo */}
            <div className="animal-photo-container">
              {animal.photo ? (
                <img 
                  src={animal.photo} 
                  alt={animal.name}
                  className="animal-photo"
                />
              ) : (
                <div className="animal-photo-placeholder">
                  <Camera className="photo-placeholder-icon" />
                  <span>No Photo</span>
                </div>
              )}
            </div>

            {/* Animal Header */}
            <div className="animal-header">
              <h3 className="animal-name">{animal.name}</h3>
              <span className={`animal-status-badge ${
                animal.status === 'healthy' ? 'healthy' : 'needs-attention'
              }`}>
                {animal.status?.replace('_', ' ') || 'N/A'}
              </span>
            </div>

            {/* Animal Details */}
            <div className="animal-details">
              <div className="animal-detail">
                <span className="animal-detail-label">Species:</span>
                <span className="animal-detail-value">{animal.species || 'N/A'}</span>
              </div>
              <div className="animal-detail">
                <span className="animal-detail-label">Breed:</span>
                <span className="animal-detail-value">{animal.breed || 'N/A'}</span>
              </div>
              <div className="animal-detail">
                <span className="animal-detail-label">Age:</span>
                <span className="animal-detail-value">{animal.age || 'N/A'} years</span>
              </div>
              <div className="animal-detail">
                <span className="animal-detail-label">Owner:</span>
                <span className="animal-detail-value">{animal.owner || 'N/A'}</span>
              </div>
            </div>

            {/* Animal Actions */}
            <div className="animal-actions">
              <button 
                onClick={() => handleViewDetails(animal)}
                className="view-details-btn"
              >
                <Eye />
                View Details
              </button>
              <button 
                onClick={() => handleEdit(animal)}
                className="edit-btn"
              >
                <Edit3 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {showDetailModal && selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedAnimal.name}'s Details</h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X />
              </button>
            </div>
            
            <div>
              {/* Photo in Details Modal */}
              {selectedAnimal.photo && (
                <div className="detail-photo-container">
                  <img 
                    src={selectedAnimal.photo} 
                    alt={selectedAnimal.name}
                    className="detail-photo"
                  />
                </div>
              )}

              <div className="detail-item">
                <span className="detail-label">Species:</span>
                <span className="detail-value">{selectedAnimal.species || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Breed:</span>
                <span className="detail-value">{selectedAnimal.breed || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{selectedAnimal.age || 'N/A'} years</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-status-badge ${
                  selectedAnimal.status === 'healthy' ? 'healthy' : 'needs-attention'
                }`}>
                  {selectedAnimal.status?.replace('_', ' ') || 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Owner:</span>
                <span className="detail-value">{selectedAnimal.owner || 'N/A'}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit {selectedAnimal.name}</h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X />
              </button>
            </div>
            
            <div className="form-group">
              {/* Photo Upload Section */}
              <div className="photo-upload-section">
                <label className="photo-upload-label">Animal Photo</label>
                {editPhotoPreview ? (
                  <div className="photo-preview-container">
                    <img 
                      src={editPhotoPreview} 
                      alt="Preview"
                      className="photo-preview"
                    />
                    <button 
                      type="button"
                      onClick={() => removePhoto(true)}
                      className="remove-photo-btn"
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <div className="photo-upload-area">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, true)}
                      className="photo-input"
                      id="edit-photo-input"
                    />
                    <label htmlFor="edit-photo-input" className="photo-upload-button">
                      <Upload />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  placeholder="Enter animal name" 
                  value={editAnimal.name || ''} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Species</label>
                <input 
                  type="text" 
                  placeholder="Enter species" 
                  value={editAnimal.species || ''} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, species: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Breed</label>
                <input 
                  type="text" 
                  placeholder="Enter breed" 
                  value={editAnimal.breed || ''} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, breed: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Age</label>
                <input 
                  type="number" 
                  placeholder="Enter age in years" 
                  value={editAnimal.age || ''} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, age: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Owner</label>
                <input 
                  type="text" 
                  placeholder="Enter owner name" 
                  value={editAnimal.owner || ''} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, owner: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Status</label>
                <select 
                  value={editAnimal.status || 'healthy'} 
                  onChange={(e) => setEditAnimal({ ...editAnimal, status: e.target.value })}
                  className="form-select"
                >
                  <option value="healthy">Healthy</option>
                  <option value="needs_attention">Needs Attention</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateAnimal} className="btn-primary">
                <Save />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Animal</h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X />
              </button>
            </div>
            
            <div className="form-group">
              {/* Photo Upload Section */}
              <div className="photo-upload-section">
                <label className="photo-upload-label">Animal Photo</label>
                {newPhotoPreview ? (
                  <div className="photo-preview-container">
                    <img 
                      src={newPhotoPreview} 
                      alt="Preview"
                      className="photo-preview"
                    />
                    <button 
                      type="button"
                      onClick={() => removePhoto(false)}
                      className="remove-photo-btn"
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <div className="photo-upload-area">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, false)}
                      className="photo-input"
                      id="new-photo-input"
                    />
                    <label htmlFor="new-photo-input" className="photo-upload-button">
                      <Upload />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  placeholder="Enter animal name" 
                  value={newAnimal.name} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Species</label>
                <input 
                  type="text" 
                  placeholder="Enter species" 
                  value={newAnimal.species} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Breed</label>
                <input 
                  type="text" 
                  placeholder="Enter breed" 
                  value={newAnimal.breed} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Age</label>
                <input 
                  type="number" 
                  placeholder="Enter age in years" 
                  value={newAnimal.age} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, age: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Owner</label>
                <input 
                  type="text" 
                  placeholder="Enter owner name" 
                  value={newAnimal.owner} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, owner: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Status</label>
                <select 
                  value={newAnimal.status} 
                  onChange={(e) => setNewAnimal({ ...newAnimal, status: e.target.value })}
                  className="form-select"
                >
                  <option value="healthy">Healthy</option>
                  <option value="needs_attention">Needs Attention</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddAnimal} className="btn-primary">
                <Save />
                Add Animal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalProfiles;