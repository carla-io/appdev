import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  Search,
  Filter,
  Calendar,
  Eye,
  AlertTriangle,
  Clock,
  User,
  Heart,
  X,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import '../CSS/Behaviors.css'; // Import the CSS for Behaviors

const API_BASE_URL = 'http://localhost:5000';

const AllBehaviorsScreen = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  
  // Seek Vet Modal states
  const [seekVetModalVisible, setSeekVetModalVisible] = useState(false);
  const [selectedAnimalForVet, setSelectedAnimalForVet] = useState(null);
  const [vets, setVets] = useState([]);
  const [vetModalLoading, setVetModalLoading] = useState(false);
  const [vetSearchText, setVetSearchText] = useState('');
  const [assigningVet, setAssigningVet] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [assignmentReason, setAssignmentReason] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [existingAssignment, setExistingAssignment] = useState(null);
  const [loadingExistingAssignment, setLoadingExistingAssignment] = useState(false);

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'seekvet', label: 'Seek Vet' },
    { key: 'normal', label: 'Normal' },
  ];

  // Fetch all behaviors
  const fetchBehaviors = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/behavior/getAll`);
      const data = await response.json();
      
      if (data.success) {
        setBehaviors(data.behaviors);
      } else {
        alert(data.message || 'Failed to fetch behaviors');
      }
    } catch (error) {
      console.error('Error fetching behaviors:', error);
      alert('Failed to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBehaviors();
  }, [fetchBehaviors]);

  // Fetch all users with userType = 'vet'
  const fetchVets = async () => {
    setVetModalLoading(true);
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
      setVetModalLoading(false);
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

  // Handle opening seek vet modal
  const handleSeekVet = (behavior) => {
    setSelectedAnimalForVet(behavior.animalId);
    setSeekVetModalVisible(true);
  };

  // Initialize modal when it becomes visible
  useEffect(() => {
    if (seekVetModalVisible) {
      fetchVets();
      setVetSearchText('');
      setSelectedVet(null);
      setAssignmentReason('');
      setDropdownOpen(false);
      setExistingAssignment(null);
    }
  }, [seekVetModalVisible]);

  // Check for existing assignment after vets are loaded
  useEffect(() => {
    if (seekVetModalVisible && selectedAnimalForVet && vets.length > 0) {
      checkExistingAssignment(selectedAnimalForVet._id);
    }
  }, [seekVetModalVisible, selectedAnimalForVet, vets]);

  // Filter vets based on search
  const filteredVets = vets.filter(vet =>
    !vetSearchText ||
    vet.name?.toLowerCase().includes(vetSearchText.toLowerCase()) ||
    vet.email?.toLowerCase().includes(vetSearchText.toLowerCase()) ||
    vet.specialization?.toLowerCase().includes(vetSearchText.toLowerCase()) ||
    vet.location?.toLowerCase().includes(vetSearchText.toLowerCase())
  );

  // Assign veterinarian to animal
  const assignVetToAnimal = async (vetId) => {
    if (!selectedAnimalForVet || !vetId) {
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
          animalId: selectedAnimalForVet._id,
          vetId: vetId,
          reason: assignmentReason.trim()
        })
      });

      const data = await response.json();
      console.log('Assignment response:', data);

      if (data.success && data.assignment) {
        if (window.confirm(`Assignment Successful\n${data.message}`)) {
          handleCloseSeekVetModal();
          fetchBehaviors(); // Refresh behaviors after assignment
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

  // Handle closing seek vet modal
  const handleCloseSeekVetModal = () => {
    setSeekVetModalVisible(false);
    setSelectedAnimalForVet(null);
    setSelectedVet(null);
    setAssignmentReason('');
    setDropdownOpen(false);
    setExistingAssignment(null);
  };

  // Check if behavior is critical
  const isCriticalBehavior = (behavior) => {
    return behavior.eating === 'None' || 
           behavior.movement === 'Limping' || 
           behavior.mood === 'Aggressive';
  };

  // Filter behaviors based on search and selected filter
  const filteredBehaviors = behaviors.filter(behavior => {
    const matchesSearch = !searchText || 
      behavior.animalId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      behavior.animalId?.species?.toLowerCase().includes(searchText.toLowerCase()) ||
      behavior.notes?.toLowerCase().includes(searchText.toLowerCase());

    const isCritical = isCriticalBehavior(behavior);

    switch (selectedFilter) {
      case 'seekvet':
        return matchesSearch && isCritical;
      case 'normal':
        return matchesSearch && !isCritical;
      default:
        return matchesSearch;
    }
  });

  // Format date
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

  // Enhanced Seek Vet Modal Component
  const SeekVetModal = () => (
    seekVetModalVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="header-left">
              <AlertTriangle size={24} color="#e53e3e" />
              <div className="header-text">
                <h2 className="modal-title">Seek Veterinarian</h2>
                <p className="modal-subtitle">
                  {selectedAnimalForVet ? `For ${selectedAnimalForVet.name}` : 'Assign a vet'}
                </p>
              </div>
            </div>
            <button className="close-button" onClick={handleCloseSeekVetModal}>
              <X size={24} color="#718096" />
            </button>
          </div>

          <div className="modal-scroll-view">
            {/* Animal Info */}
            {selectedAnimalForVet && (
              <div className="animal-info-section">
                <h3 className="section-title">Animal Information</h3>
                <div className="animal-info-card">
                  <div className="animal-name">{selectedAnimalForVet.name}</div>
                  <div className="animal-details">
                    {selectedAnimalForVet.species} • {selectedAnimalForVet.breed}
                  </div>
                  {selectedAnimalForVet.age && (
                    <div className="animal-age">Age: {selectedAnimalForVet.age}</div>
                  )}
                </div>
              </div>
            )}

            {/* Existing Assignment Status */}
            {selectedAnimalForVet && (
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
              
              {vetModalLoading ? (
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
                          value={vetSearchText}
                          onChange={(e) => setVetSearchText(e.target.value)}
                        />
                      </div>

                      <div className="dropdown-scroll-view">
                        {filteredVets.length === 0 ? (
                          <div className="empty-dropdown">
                            <Stethoscope size={32} color="#a0aec0" />
                            <div className="empty-dropdown-text">
                              {vetSearchText ? 'No veterinarians match your search' : 'No veterinarians available'}
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
    )
  );

  // Render behavior card
  const renderBehaviorCard = (behavior) => (
    <div key={behavior._id} className="behavior-card">
      <div className="behavior-header">
        <div className="animal-info">
          <h3 className="animal-name">
            {behavior.animalId?.name || 'Unknown Animal'}
          </h3>
          <p className="animal-species">
            {behavior.animalId?.species} • {behavior.animalId?.breed}
          </p>
        </div>
        <div className={`status-badge ${isCriticalBehavior(behavior) ? 'status-critical' : 'status-healthy'}`}>
          <span className="status-text">
            {isCriticalBehavior(behavior) ? 'Critical' : 'Normal'}
          </span>
        </div>
      </div>

      <div className="behavior-details">
        <div className="behavior-row">
          <span className="behavior-label">Eating:</span>
          <span className={`behavior-value ${behavior.eating === 'None' ? 'critical-text' : ''}`}>
            {behavior.eating}
          </span>
        </div>

        <div className="behavior-row">
          <span className="behavior-label">Movement:</span>
          <span className={`behavior-value ${behavior.movement === 'Limping' ? 'critical-text' : ''}`}>
            {behavior.movement}
          </span>
        </div>

        <div className="behavior-row">
          <span className="behavior-label">Mood:</span>
          <span className={`behavior-value ${behavior.mood === 'Aggressive' ? 'critical-text' : ''}`}>
            {behavior.mood}
          </span>
        </div>

        {behavior.notes && (
          <div className="notes-container">
            <span className="behavior-label">Notes:</span>
            <p className="notes-text">
              {behavior.notes.length > 100 ? behavior.notes.substring(0, 100) + '...' : behavior.notes}
            </p>
          </div>
        )}
      </div>

      <div className="behavior-footer">
        <div className="time-info">
          <Clock size={14} />
          <span className="time-text">
            {formatDate(behavior.createdAt)}
          </span>
        </div>

        <div className="footer-buttons">
          {isCriticalBehavior(behavior) && (
            <button
              className="seek-vet-button"
              onClick={() => handleSeekVet(behavior)}
            >
              <AlertTriangle size={16} />
              <span>Seek Vet</span>
            </button>
          )}
          
          <button
            className="view-button"
            onClick={() => {
              setSelectedBehavior(behavior);
              setDetailModalVisible(true);
            }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render detail modal
  const renderDetailModal = () => (
    detailModalVisible && (
      <div className="modal-overlay" onClick={() => setDetailModalVisible(false)}>
        <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Behavior Details</h2>
            <button
              className="close-button"
              onClick={() => setDetailModalVisible(false)}
            >
              ×
            </button>
          </div>

          <div className="modal-body detail-modal-body">
            {selectedBehavior && (
              <>
                <div className="detail-section">
                  <h3 className="section-title">Animal Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">
                      {selectedBehavior.animalId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Species</span>
                    <span className="detail-value">
                      {selectedBehavior.animalId?.species || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Breed</span>
                    <span className="detail-value">
                      {selectedBehavior.animalId?.breed || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Behavior Data</h3>
                  <div className="detail-item">
                    <span className="detail-label">Eating</span>
                    <span className={`detail-value ${selectedBehavior.eating === 'None' ? 'critical-text' : ''}`}>
                      {selectedBehavior.eating}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Movement</span>
                    <span className={`detail-value ${selectedBehavior.movement === 'Limping' ? 'critical-text' : ''}`}>
                      {selectedBehavior.movement}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mood</span>
                    <span className={`detail-value ${selectedBehavior.mood === 'Aggressive' ? 'critical-text' : ''}`}>
                      {selectedBehavior.mood}
                    </span>
                  </div>
                </div>

                {selectedBehavior.notes && (
                  <div className="detail-section">
                    <h3 className="section-title">Notes</h3>
                    <p className="full-notes-text">
                      {selectedBehavior.notes}
                    </p>
                  </div>
                )}

                <div className="detail-section">
                  <h3 className="section-title">Record Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Recorded By</span>
                    <span className="detail-value">
                      {selectedBehavior.recordedBy?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date & Time</span>
                    <span className="detail-value">
                      {formatDate(selectedBehavior.createdAt)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  // Render loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading behaviors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-center">
              <h1 className="header-title">Animal Behaviors</h1>
              <p className="header-subtitle">
                {filteredBehaviors.length} records found
              </p>
            </div>
            <button className="refresh-button" onClick={fetchBehaviors} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by animal name, species, or notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filter Options */}
        <div className="filter-container">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              className={`filter-button ${selectedFilter === option.key ? 'filter-button-active' : ''} ${
                option.key === 'seekvet' && selectedFilter === option.key ? 'filter-button-critical' : ''
              }`}
              onClick={() => setSelectedFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Behaviors List */}
        <div className="behaviors-list">
          {filteredBehaviors.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} className="empty-state-icon" />
              <h2 className="empty-state-title">No behaviors found</h2>
              <p className="empty-state-text">
                {searchText || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No behavior records have been added yet.'
                }
              </p>
            </div>
          ) : (
            filteredBehaviors.map(renderBehaviorCard)
          )}
        </div>
      </div>

      {/* Modals */}
      <SeekVetModal />
      {renderDetailModal()}
    </div>
  );
};

export default AllBehaviorsScreen;