import React, { useEffect, useState } from 'react';
import { PlusCircle, Edit3, Eye, X, Save, Camera, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/AnimalProfile.css';

const AnimalProfiles = ({ setShowAnimalModal }) => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modals, setModals] = useState({
    detail: false,
    edit: false,
    add: false,
    delete: false
  });
  const [editAnimal, setEditAnimal] = useState({});
  const [newAnimal, setNewAnimal] = useState({
    name: '', species: '', breed: '', age: '', status: 'healthy', owner: ''
  });
  const [photos, setPhotos] = useState({
    editFile: null, newFile: null, editPreview: '', newPreview: ''
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/animal/getAll');
      if (response.data.success) {
        setAnimals(response.data.animals);
        toast.success('Animals loaded successfully!');
      }
    } catch (error) {
      toast.error('Error fetching animals');
      console.error('Error:', error.message);
    }
  };

  const handlePhotoChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({
          ...prev,
          [isEdit ? 'editFile' : 'newFile']: file,
          [isEdit ? 'editPreview' : 'newPreview']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (isEdit = false) => {
    setPhotos(prev => ({
      ...prev,
      [isEdit ? 'editFile' : 'newFile']: null,
      [isEdit ? 'editPreview' : 'newPreview']: ''
    }));
  };

  const openModal = (type, animal = null) => {
    setModals({ detail: false, edit: false, add: false, delete: false, [type]: true });
    if (animal) {
      setSelectedAnimal(animal);
      if (type === 'edit') {
        setEditAnimal({ ...animal });
        setPhotos(prev => ({ ...prev, editPreview: animal.photo || '' }));
      }
    }
  };

  const closeModal = () => {
    setModals({ detail: false, edit: false, add: false, delete: false });
    setSelectedAnimal(null);
    setEditAnimal({});
    setNewAnimal({ name: '', species: '', breed: '', age: '', status: 'healthy', owner: '' });
    setPhotos({ editFile: null, newFile: null, editPreview: '', newPreview: '' });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/animal/delete/${selectedAnimal._id}`);
      if (response.data.success) {
        setAnimals(prev => prev.filter(animal => animal._id !== selectedAnimal._id));
        toast.success(`${selectedAnimal.name} deleted successfully!`);
        closeModal();
      }
    } catch (error) {
      toast.error('Error deleting animal');
      console.error('Error:', error);
    }
  };

  const submitForm = async (isEdit = false) => {
    try {
      const formData = new FormData();
      const data = isEdit ? editAnimal : newAnimal;
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const photoFile = isEdit ? photos.editFile : photos.newFile;
      if (photoFile) formData.append('photo', photoFile);

      const url = isEdit 
        ? `http://localhost:5000/animal/update/${editAnimal._id}`
        : 'http://localhost:5000/animal/add';
      
      const response = await axios[isEdit ? 'put' : 'post'](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        if (isEdit) {
          setAnimals(prev => prev.map(animal => 
            animal._id === editAnimal._id ? response.data.animal : animal
          ));
          toast.success(`${editAnimal.name} updated successfully!`);
        } else {
          setAnimals(prev => [...prev, response.data.animal]);
          toast.success(`${newAnimal.name} added successfully!`);
        }
        closeModal();
      }
    } catch (error) {
      toast.error(`Error ${isEdit ? 'updating' : 'adding'} animal`);
      console.error('Error:', error);
    }
  };

  const renderPhotoSection = (isEdit = false) => {
    const preview = isEdit ? photos.editPreview : photos.newPreview;
    const inputId = isEdit ? 'edit-photo-input' : 'new-photo-input';
    
    return (
      <div className="photo-upload-section">
        <label className="photo-upload-label">Animal Photo</label>
        {preview ? (
          <div className="photo-preview-container">
            <img src={preview} alt="Preview" className="photo-preview" />
            <button type="button" onClick={() => removePhoto(isEdit)} className="remove-photo-btn">
              <X />
            </button>
          </div>
        ) : (
          <div className="photo-upload-area">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, isEdit)}
              className="photo-input"
              id={inputId}
            />
            <label htmlFor={inputId} className="photo-upload-button">
              <Upload />
              <span>Upload Photo</span>
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderFormFields = (data, setData) => (
    <>
      {renderPhotoSection(data === editAnimal)}
      {['name', 'species', 'breed', 'age', 'owner'].map(field => (
        <div key={field} className="form-field">
          <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input 
            type={field === 'age' ? 'number' : 'text'}
            placeholder={`Enter ${field}${field === 'age' ? ' in years' : ''}`}
            value={data[field] || ''} 
            onChange={(e) => setData(prev => ({ ...prev, [field]: e.target.value }))}
            className="form-input"
          />
        </div>
      ))}
      <div className="form-field">
        <label className="form-label">Status</label>
        <select 
          value={data.status || 'healthy'} 
          onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}
          className="form-select"
        >
          <option value="healthy">Healthy</option>
          <option value="needs_attention">Needs Attention</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="animal-profiles-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Header */}
      <div className="animal-profiles-header">
        <h1 className="animal-profiles-title">Animal Profiles</h1>
        <button onClick={() => openModal('add')} className="add-animal-btn">
          <PlusCircle /> Add Animal
        </button>
      </div>

      {/* Animals Grid */}
      <div className="animals-grid">
        {animals.map(animal => (
          <div key={animal._id} className="animal-card">
            <div className="animal-photo-container">
              {animal.photo ? (
                <img src={animal.photo} alt={animal.name} className="animal-photo" />
              ) : (
                <div className="animal-photo-placeholder">
                  <Camera className="photo-placeholder-icon" />
                  <span>No Photo</span>
                </div>
              )}
            </div>

            <div className="animal-header">
              <h3 className="animal-name">{animal.name}</h3>
              <span className={`animal-status-badge ${animal.status === 'healthy' ? 'healthy' : 'needs-attention'}`}>
                {animal.status?.replace('_', ' ') || 'N/A'}
              </span>
            </div>

            <div className="animal-details">
              {['species', 'breed', 'age', 'owner'].map(field => (
                <div key={field} className="animal-detail">
                  <span className="animal-detail-label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                  <span className="animal-detail-value">{animal[field] || 'N/A'}{field === 'age' ? ' years' : ''}</span>
                </div>
              ))}
            </div>

            <div className="animal-actions">
              <button onClick={() => openModal('detail', animal)} className="view-details-btn">
                <Eye /> View Details
              </button>
              <button onClick={() => openModal('edit', animal)} className="edit-btn">
                <Edit3 />
              </button>
              <button onClick={() => openModal('delete', animal)} className="delete-btn">
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {modals.detail && selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedAnimal.name}'s Details</h2>
              <button onClick={closeModal} className="modal-close-btn"><X /></button>
            </div>
            <div>
              {selectedAnimal.photo && (
                <div className="detail-photo-container">
                  <img src={selectedAnimal.photo} alt={selectedAnimal.name} className="detail-photo" />
                </div>
              )}
              {['species', 'breed', 'age', 'owner'].map(field => (
                <div key={field} className="detail-item">
                  <span className="detail-label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                  <span className="detail-value">{selectedAnimal[field] || 'N/A'}{field === 'age' ? ' years' : ''}</span>
                </div>
              ))}
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-status-badge ${selectedAnimal.status === 'healthy' ? 'healthy' : 'needs-attention'}`}>
                  {selectedAnimal.status?.replace('_', ' ') || 'N/A'}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modals.edit && selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit {selectedAnimal.name}</h2>
              <button onClick={closeModal} className="modal-close-btn"><X /></button>
            </div>
            <div className="form-group">
              {renderFormFields(editAnimal, setEditAnimal)}
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={() => submitForm(true)} className="btn-primary">
                <Save /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modals.add && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Animal</h2>
              <button onClick={closeModal} className="modal-close-btn"><X /></button>
            </div>
            <div className="form-group">
              {renderFormFields(newAnimal, setNewAnimal)}
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={() => submitForm(false)} className="btn-primary">
                <Save /> Add Animal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modals.delete && selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Animal</h2>
              <button onClick={closeModal} className="modal-close-btn"><X /></button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning-icon">
                <Trash2 className="warning-icon" />
              </div>
              <p className="delete-warning-text">
                Are you sure you want to delete <strong>{selectedAnimal.name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">
                <Trash2 /> Delete Animal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalProfiles;