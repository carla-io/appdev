import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Search,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
} from 'lucide-react';
import '../CSS/SeekVetModal.css'; // Import the CSS for Health Logs

const API_BASE_URL = 'http://localhost:5000';

const HealthLogs = ({ animals }) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [assigningVet, setAssigningVet] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [assignmentReason, setAssignmentReason] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // New state for vet assignments
  const [vetAssignments, setVetAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  
  // New state for checking existing assignment
  const [existingAssignment, setExistingAssignment] = useState(null);
  const [loadingExistingAssignment, setLoadingExistingAssignment] = useState(false);

  // Fetch all users with userType = 'vet'
  const fetchVets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/getAllVetsOnly`);
      const data = await response.json();
      console.log('Response:', data);
      
      if (data.success) {
        setVets(data.users || []);
        console.log('All users loaded:', data.users?.length);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Check for existing assignment
  const checkExistingAssignment = async (animalId) => {
    if (!animalId) return;
    
    setLoadingExistingAssignment(true);
    try {
      const response = await fetch(`${API_BASE_URL}/behavior/assigned-vet/${animalId}`);
      const data = await response.json();
      console.log('Existing assignment response:', data);
      
      if (data.success) {
        const assignment = data.assignment;
        setExistingAssignment(assignment);
        
        // Find and set the assigned vet in the vets list
        const assignedVet = vets.find(vet => vet._id === assignment.vet._id);
        if (assignedVet) {
          setSelectedVet(assignedVet);
        }
        
        // Set the assignment reason
        if (assignment.reason) {
          setAssignmentReason(assignment.reason);
        }
      } else {
        setExistingAssignment(null);
      }
    } catch (error) {
      console.error('Error checking existing assignment:', error);
      setExistingAssignment(null);
    } finally {
      setLoadingExistingAssignment(false);
    }
  };

  // Initialize modal when it becomes visible
  useEffect(() => {
    if (showModal) {
      fetchVets();
      setSearchText('');
      setSelectedVet(null);
      setAssignmentReason('');
      setDropdownOpen(false);
      setVetAssignments([]);
      setExistingAssignment(null);
    }
  }, [showModal]);

  // Check for existing assignment after vets are loaded
  useEffect(() => {
    if (showModal && selectedAnimal && vets.length > 0) {
      checkExistingAssignment(selectedAnimal._id);
    }
  }, [showModal, selectedAnimal, vets]);

  // Filter vets based on search
  const filteredVets = vets.filter(vet =>
    !searchText ||
    vet.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    vet.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    vet.specialization?.toLowerCase().includes(searchText.toLowerCase()) ||
    vet.location?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Assign veterinarian to animal
  const assignVetToAnimal = async (vetId) => {
    if (!selectedAnimal || !vetId) {
      alert('Missing animal or veterinarian information');
      return;
    }

    if (!assignmentReason.trim()) {
      alert('Please provide a reason for the veterinary assignment');
      return;
    }

    setAssigningVet(vetId);
    try {
      const response = await fetch(`${API_BASE_URL}/behavior/assign-vet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: selectedAnimal._id,
          vetId: vetId,
          reason: assignmentReason.trim()
        })
      });

      const data = await response.json();
      console.log('Assignment response:', data);

      if (data.success && data.assignment) {
        if (window.confirm(`Assignment Successful\n${data.message}`)) {
          setShowModal(false);
          setSelectedAnimal(null);
        }
      } else {
        alert(data.message || 'Assignment completed but with unexpected response format');
      }

    } catch (error) {
      console.error('Error assigning vet:', error);
      alert(`Assignment Failed: ${error.message}`);
    } finally {
      setAssigningVet(null);
    }
  };

  // Handle vet selection from dropdown
  const handleVetSelect = (vet) => {
    setSelectedVet(vet);
    setDropdownOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  // Handle opening modal
  const openModal = (animal) => {
    setSelectedAnimal(animal);
    setShowModal(true);
  };

  // Handle closing modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAnimal(null);
    setSelectedVet(null);
    setAssignmentReason('');
    setDropdownOpen(false);
    setExistingAssignment(null);
  };

  // Render dropdown item
  const renderDropdownItem = (vet) => (
    <div
      key={vet._id}
      className="dropdown-item"
      onClick={() => handleVetSelect(vet)}
    >
      <div className="dropdown-item-content">
        <div className="dropdown-vet-info">
          <div className="dropdown-vet-name">{vet.name}</div>
          <div className="dropdown-vet-title">
            {vet.specialization || 'General Veterinarian'}
          </div>
          {vet.email && (
            <div className="dropdown-vet-email">{vet.email}</div>
          )}
        </div>
        <div className="vet-badge">
          <Stethoscope size={12} color="#315342" />
          <span className="vet-badge-text">VET</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="health-logs-container">
      <div className="health-logs-header">
        <h1 className="page-title">Health Logs & Veterinary Assignments</h1>
        <p className="page-subtitle">Manage animal health records and assign veterinarians</p>
      </div>

      <div className="animals-grid">
        {animals && animals.length > 0 ? (
          animals.map((animal) => (
            <div key={animal._id} className="animal-card">
              <div className="animal-card-header">
                <h3 className="animal-card-name">{animal.name}</h3>
                <div className="animal-card-species">{animal.species}</div>
              </div>
              <div className="animal-card-details">
                <p><strong>Breed:</strong> {animal.breed}</p>
                {animal.age && <p><strong>Age:</strong> {animal.age}</p>}
                {animal.weight && <p><strong>Weight:</strong> {animal.weight}</p>}
              </div>
              <button 
                className="assign-vet-btn"
                onClick={() => openModal(animal)}
              >
                <Stethoscope size={16} />
                Assign Veterinarian
              </button>
            </div>
          ))
        ) : (
          <div className="no-animals">
            <AlertTriangle size={48} color="#a0aec0" />
            <h3>No Animals Available</h3>
            <p>Add animals to the system to manage their health logs.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <div className="header-left">
                <AlertTriangle size={24} color="#e53e3e" />
                <div className="header-text">
                  <h2 className="modal-title">Seek Veterinarian</h2>
                  <p className="modal-subtitle">
                    {selectedAnimal ? `For ${selectedAnimal.name}` : 'Assign a vet'}
                  </p>
                </div>
              </div>
              <button className="close-button" onClick={closeModal}>
                <X size={24} color="#718096" />
              </button>
            </div>

            <div className="modal-scroll-view">
              {/* Animal Info */}
              {selectedAnimal && (
                <div className="animal-info-section">
                  <h3 className="section-title">Animal Information</h3>
                  <div className="animal-info-card">
                    <div className="animal-name">{selectedAnimal.name}</div>
                    <div className="animal-details">
                      {selectedAnimal.species} • {selectedAnimal.breed}
                    </div>
                    {selectedAnimal.age && (
                      <div className="animal-age">Age: {selectedAnimal.age}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Existing Assignment Status */}
              {selectedAnimal && (
                <div className="assignment-status-section">
                  <h3 className="section-title">Assignment Status</h3>
                  
                  {loadingExistingAssignment ? (
                    <div className="loading-status">
                      <div className="loading-spinner"></div>
                      <span className="loading-text">Checking assignment status...</span>
                    </div>
                  ) : existingAssignment ? (
                    <div className="existing-assignment-card">
                      <div className="assignment-status-header">
                        <div className="status-badge-assigned">
                          <UserCheck size={16} color="#38a169" />
                          <span className="status-badge-text">ASSIGNED</span>
                        </div>
                        <span className="assignment-date">
                          {formatDate(existingAssignment.assignedAt)}
                        </span>
                      </div>
                      
                      <div className="assigned-vet-info">
                        <div className="assigned-vet-header">
                          <Stethoscope size={18} color="#315342" />
                          <span className="assigned-vet-name">
                            Veterinarian ID: {existingAssignment.vet._id}
                          </span>
                        </div>
                        
                        {existingAssignment.reason && (
                          <div className="assignment-reason-container">
                            <FileText size={14} color="#718096" />
                            <span className="existing-reason-text">
                              {existingAssignment.reason}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="reassignment-note">
                        <AlertTriangle size={14} color="#d69e2e" />
                        <span className="reassignment-note-text">
                          This animal already has an assigned veterinarian. Proceeding will reassign to a new vet.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="unassigned-card">
                      <div className="status-badge-unassigned">
                        <AlertTriangle size={16} color="#e53e3e" />
                        <span className="status-badge-text-unassigned">UNASSIGNED</span>
                      </div>
                      <div className="unassigned-text">
                        No veterinarian has been assigned to this animal yet.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Veterinarian Dropdown */}
              <div className="dropdown-section">
                <h3 className="section-title">
                  {existingAssignment ? 'Assigned Veterinarian' : 'Select Veterinarian'}
                </h3>
                
                {loading ? (
                  <div className="loading-dropdown">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading veterinarians...</span>
                  </div>
                ) : (
                  <div className="dropdown-container">
                    <button
                      className={`dropdown-button ${dropdownOpen ? 'dropdown-button-open' : ''} ${
                        existingAssignment && !dropdownOpen ? 'dropdown-button-readonly' : ''
                      }`}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      disabled={loadingExistingAssignment}
                    >
                      <div className="dropdown-button-content">
                        <span className={`dropdown-button-text ${selectedVet ? 'selected' : ''}`}>
                          {selectedVet ? selectedVet.name : 'Choose a veterinarian...'}
                          {existingAssignment && selectedVet && ' (Currently Assigned)'}
                        </span>
                        {dropdownOpen ? (
                          <ChevronUp size={20} color="#718096" />
                        ) : (
                          <ChevronDown size={20} color="#718096" />
                        )}
                      </div>
                    </button>

                    {dropdownOpen && (
                      <div className="dropdown-list">
                        {/* Search Bar inside dropdown */}
                        <div className="dropdown-search-container">
                          <Search size={16} color="#718096" />
                          <input
                            className="dropdown-search-input"
                            placeholder="Search veterinarians..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>

                        <div className="dropdown-scroll-view">
                          {filteredVets.length === 0 ? (
                            <div className="empty-dropdown">
                              <Stethoscope size={32} color="#a0aec0" />
                              <div className="empty-dropdown-text">
                                {searchText ? 'No veterinarians match your search' : 'No veterinarians available'}
                              </div>
                            </div>
                          ) : (
                            filteredVets.map(renderDropdownItem)
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Vet Details */}
              {selectedVet && (
                <div className="selected-vet-section">
                  <h3 className="section-title">Selected Veterinarian</h3>
                  <div className="selected-vet-card">
                    <div className="selected-vet-header">
                      <div className="selected-vet-info">
                        <div className="selected-vet-name">{selectedVet.name}</div>
                        <div className="selected-vet-title">
                          {selectedVet.specialization || 'General Veterinarian'}
                        </div>
                      </div>
                      <div className="vet-badge">
                        <Stethoscope size={16} color="#315342" />
                        <span className="vet-badge-text">VET</span>
                      </div>
                    </div>

                    <div className="selected-vet-details">
                      {selectedVet.email && (
                        <div className="selected-vet-detail-row">
                          <Mail size={14} color="#718096" />
                          <span className="selected-vet-detail-text">{selectedVet.email}</span>
                        </div>
                      )}
                      
                      {selectedVet.phone && (
                        <div className="selected-vet-detail-row">
                          <Phone size={14} color="#718096" />
                          <span className="selected-vet-detail-text">{selectedVet.phone}</span>
                        </div>
                      )}
                      
                      {selectedVet.location && (
                        <div className="selected-vet-detail-row">
                          <MapPin size={14} color="#718096" />
                          <span className="selected-vet-detail-text">{selectedVet.location}</span>
                        </div>
                      )}

                      {selectedVet.experience && (
                        <div className="selected-vet-detail-row">
                          <Clock size={14} color="#718096" />
                          <span className="selected-vet-detail-text">{selectedVet.experience} years experience</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Reason */}
              {(selectedVet || existingAssignment) && (
                <div className="reason-section">
                  <h3 className="section-title">
                    Assignment Reason
                    {existingAssignment && ' (Current)'}
                  </h3>
                  <textarea
                    className="reason-input"
                    placeholder="Describe the reason for veterinary consultation..."
                    value={assignmentReason}
                    onChange={(e) => setAssignmentReason(e.target.value)}
                    rows={3}
                  />
                  {existingAssignment && (
                    <div className="reason-hint">
                      You can modify the reason above if reassigning to a different veterinarian.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {existingAssignment && !selectedVet && (
                <button
                  className="reassign-button"
                  onClick={() => setDropdownOpen(true)}
                >
                  Reassign Veterinarian
                </button>
              )}
              
              {selectedVet && (
                <>
                  <button
                    className="cancel-button"
                    onClick={() => setSelectedVet(null)}
                  >
                    Clear Selection
                  </button>
                  <button
                    className={`assign-button ${
                      (!selectedVet || !assignmentReason.trim() || !!assigningVet) ? 'disabled' : ''
                    }`}
                    onClick={() => assignVetToAnimal(selectedVet._id)}
                    disabled={!selectedVet || !assignmentReason.trim() || assigningVet !== null}
                  >
                    {assigningVet ? (
                      <div className="loading-spinner small"></div>
                    ) : (
                      <span>
                        {existingAssignment ? 'Reassign Veterinarian' : 'Assign Veterinarian'}
                      </span>
                    )}
                  </button>
                </>
              )}
              
              {!existingAssignment && !selectedVet && (
                <button className="assign-button disabled" disabled>
                  Select a Veterinarian First
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthLogs;