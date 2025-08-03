import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, X, ChevronDown, ChevronUp, UtensilsCrossed, Brush, Activity, Pill, AlertCircle, Scale, Repeat, Plus, Minus, CheckCircle, User, Heart, Camera, Shield, ShieldCheck, Info, Expand } from 'lucide-react';
import axios from 'axios';
import '../CSS/TaskModal.css'; // Import the CSS for Task Modal

const API_BASE_URL = 'http://localhost:5000';

const TaskModal = ({ showTaskModal, setShowTaskModal, setEditingTask, editingTask }) => {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [formData, setFormData] = useState({
    type: '',
    animal: '',
    assignedTo: '',
    scheduleDate: '',
    scheduleTimes: [''],
    status: 'Pending',
    isRecurring: false,
    recurrencePattern: 'Daily',
    endDate: '',
    completedAt: '',
    completionVerified: false,
    imageProof: ''
  });

  const showToast = (type, text1, text2 = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, text1, text2 }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (showTaskModal) {
      fetchInitialData();
    }
  }, [showTaskModal]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      console.log('API_BASE_URL:', API_BASE_URL);
      
      let usersData = [];
      try {
        console.log('Fetching users from:', `${API_BASE_URL}/user/getAllUsersOnly`);
        const usersResponse = await axios.get(`${API_BASE_URL}/user/getAllUsersOnly`);
        usersData = usersResponse.data.users || usersResponse.data || [];
        console.log('Users fetched successfully:', usersData.length);
      } catch (userError) {
        console.error('Error fetching users:', userError.response?.status, userError.response?.data);
        
        try {
          console.log('Trying alternative users endpoint:', `${API_BASE_URL}/user/getAll`);
          const altUsersResponse = await axios.get(`${API_BASE_URL}/user/getAll`);
          usersData = altUsersResponse.data.users || altUsersResponse.data || [];
          console.log('Users fetched from alternative endpoint:', usersData.length);
        } catch (altError) {
          console.error('Alternative users endpoint also failed:', altError.response?.status);
          showToast('error', 'Failed to load users', 'Users endpoint not available');
        }
      }

      let animalsData = [];
      try {
        console.log('Fetching animals from:', `${API_BASE_URL}/animal/getAll`);
        const animalsResponse = await axios.get(`${API_BASE_URL}/animal/getAll`);
        animalsData = animalsResponse.data.animals || animalsResponse.data || [];
        console.log('Animals fetched successfully:', animalsData.length);
      } catch (animalError) {
        console.error('Error fetching animals:', animalError.response?.status, animalError.response?.data);
        
        try {
          console.log('Trying alternative animals endpoint:', `${API_BASE_URL}/animals/getAll`);
          const altAnimalsResponse = await axios.get(`${API_BASE_URL}/animals/getAll`);
          animalsData = altAnimalsResponse.data.animals || altAnimalsResponse.data || [];
          console.log('Animals fetched from alternative endpoint:', animalsData.length);
        } catch (altError) {
          console.error('Alternative animals endpoint also failed:', altError.response?.status);
          showToast('error', 'Failed to load animals', 'Animals endpoint not available');
        }
      }

      setUsers(usersData);
      setAnimals(animalsData);

      if (usersData.length > 0 || animalsData.length > 0) {
        showToast('success', 'Data loaded successfully!', `${usersData.length} users, ${animalsData.length} animals`);
      } else {
        showToast('warning', 'No data available', 'Please check your API endpoints');
      }

    } catch (err) {
      console.error('General error fetching initial data:', err);
      showToast('error', 'Failed to load data', 'Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingTask) {
      setFormData({
        type: editingTask.type || '',
        animal: editingTask.animalId?._id || editingTask.animalId || '',
        assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || '',
        scheduleDate: editingTask.scheduleDate ? new Date(editingTask.scheduleDate).toISOString().split('T')[0] : '',
        scheduleTimes: editingTask.scheduleTimes && editingTask.scheduleTimes.length > 0 ? editingTask.scheduleTimes : [''],
        status: editingTask.status || 'Pending',
        isRecurring: editingTask.isRecurring || false,
        recurrencePattern: editingTask.recurrencePattern || 'Daily',
        endDate: editingTask.endDate ? new Date(editingTask.endDate).toISOString().split('T')[0] : '',
        completedAt: editingTask.completedAt || '',
        completionVerified: editingTask.completionVerified || false,
        imageProof: editingTask.imageProof || ''
      });
      showToast('info', 'Editing task', `${editingTask.type}`);
    } else {
      setFormData({
        type: '',
        animal: '',
        assignedTo: '',
        scheduleDate: '',
        scheduleTimes: [''],
        status: 'Pending',
        isRecurring: false,
        recurrencePattern: 'Daily',
        endDate: '',
        completedAt: '',
        completionVerified: false,
        imageProof: ''
      });
    }
  }, [editingTask]);

  const taskTypes = [
    { value: 'Feeding', label: 'Feeding', icon: UtensilsCrossed },
    { value: 'Cleaning', label: 'Cleaning', icon: Brush },
    { value: 'Health Check', label: 'Health Check', icon: Activity },
    { value: 'Medication', label: 'Medication', icon: Pill },
    { value: 'Observation', label: 'Observation', icon: Eye },
    { value: 'Weight Monitoring', label: 'Weight Monitoring', icon: Scale }
  ];

  const recurrenceOptions = [
    { value: 'Daily', label: 'Daily', icon: Calendar },
    { value: 'Weekly', label: 'Weekly', icon: Calendar },
    { value: 'Monthly', label: 'Monthly', icon: Calendar }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: Clock, color: '#ffc107' },
    { value: 'Completed', label: 'Completed', icon: CheckCircle, color: '#28a745' }
  ];

  // Generate time options (15-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({ value: timeString, label: timeString });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.scheduleTimes];
    newTimes[index] = value;
    setFormData(prev => ({ ...prev, scheduleTimes: newTimes }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      scheduleTimes: [...prev.scheduleTimes, '']
    }));
    showToast('info', 'Added new time slot');
  };

  const removeTimeSlot = (index) => {
    if (formData.scheduleTimes.length > 1) {
      const newTimes = formData.scheduleTimes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, scheduleTimes: newTimes }));
      showToast('info', 'Removed time slot');
    }
  };

  const handleVerificationToggle = (isVerified) => {
    setFormData(prev => ({
      ...prev,
      completionVerified: isVerified,
      status: isVerified ? 'Completed' : 'Pending',
      completedAt: isVerified && !prev.completedAt ? new Date().toISOString() : prev.completedAt
    }));

    showToast(
      isVerified ? 'success' : 'info',
      isVerified ? 'Task marked as completed' : 'Task marked as pending',
      isVerified ? 'Verification approved and task completed' : 'Verification removed and task set to pending'
    );
  };

  const validateForm = () => {
    if (!formData.type || !formData.animal || !formData.assignedTo || !formData.scheduleDate) {
      showToast('error', 'Please fill all required fields');
      return false;
    }

    if (formData.isRecurring && !formData.endDate) {
      showToast('error', 'Please select an end date for recurring tasks');
      return false;
    }

    const validTimes = formData.scheduleTimes.filter(time => time.trim() !== '');
    if (validTimes.length === 0) {
      showToast('error', 'Please provide at least one schedule time');
      return false;
    }

    const timeRegex = /^\d{2}:\d{2}$/;
    const invalidTimes = validTimes.filter(time => !timeRegex.test(time));
    if (invalidTimes.length > 0) {
      showToast('error', 'Please ensure all times are in HH:MM format');
      return false;
    }

    if (formData.isRecurring && formData.endDate) {
      const startDate = new Date(formData.scheduleDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        showToast('error', 'End date must be after the schedule date');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const validTimes = formData.scheduleTimes.filter(time => time.trim() !== '');

    const payload = {
      type: formData.type,
      animalId: formData.animal,
      assignedTo: formData.assignedTo,
      scheduleDate: formData.scheduleDate,
      scheduleTimes: validTimes,
      status: formData.status,
      isRecurring: formData.isRecurring,
      completionVerified: formData.completionVerified
    };

    if (formData.isRecurring) {
      payload.recurrencePattern = formData.recurrencePattern;
      payload.endDate = formData.endDate;
    }

    if (formData.imageProof) {
      payload.imageProof = formData.imageProof;
    }

    if (formData.status === 'Completed' && formData.completedAt) {
      payload.completedAt = formData.completedAt;
    }

    try {
      const animalName = animals.find(animal => animal._id === formData.animal)?.name || 'Unknown';
      const userName = users.find(user => user._id === formData.assignedTo)?.name || 'Unknown';

      console.log('Submitting payload:', payload);

      if (editingTask) {
        const editUrl = `${API_BASE_URL}/tasks/edit/${editingTask._id}`;
        console.log('Updating task at:', editUrl);
        await axios.put(editUrl, payload);
        showToast('success', 'Task updated successfully!', `"${formData.type}" for ${animalName}`);
      } else {
        const createUrl = `${API_BASE_URL}/tasks/add`;
        console.log('Creating task at:', createUrl);
        await axios.post(createUrl, payload);
        showToast('success', 'Task assigned successfully!', `"${formData.type}" assigned to ${userName} for ${animalName}`);
      }

      handleClose();
      
    } catch (err) {
      console.error('Failed to submit task:', err);
      console.error('Error details:', err.response?.data);
      
      if (err.response?.data?.message) {
        showToast('error', err.response.data.message);
      } else if (err.response?.status === 404) {
        showToast('error', 'Task endpoint not found', 'Please check your API configuration');
      } else {
        showToast('error', 'Something went wrong', 'Please check the input and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      type: '', 
      animal: '', 
      assignedTo: '', 
      scheduleDate: '', 
      scheduleTimes: [''],
      status: 'Pending',
      isRecurring: false,
      recurrencePattern: 'Daily',
      endDate: '',
      completedAt: '',
      completionVerified: false,
      imageProof: ''
    });
    setEditingTask(null);
    setShowTaskModal(false);
    setShowDropdown(null);
    setShowImageModal(false);
    showToast('info', 'Task form closed');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const VerificationStatusButton = () => {
    if (!formData.imageProof) return null;

    const isVerified = formData.completionVerified;
    const Icon = isVerified ? CheckCircle : AlertCircle;

    return (
      <div className="verification-status-container">
        <button 
          className={`verification-status-button ${isVerified ? 'verified' : 'unverified'}`}
          onClick={() => setShowImageModal(true)}
        >
          <Icon size={20} />
          <span className="verification-status-text">
            {isVerified ? 'Task Verified & Completed' : 'Task Awaiting Verification'}
          </span>
          <Eye size={16} />
        </button>
      </div>
    );
  };

  const ImageProofSection = () => {
    if (!formData.imageProof && !editingTask) return null;

    return (
      <div className="form-group">
        <label className="form-label">Completion Proof & Verification</label>
        {formData.imageProof ? (
          <div className="image-proof-container">
            <button
              className="image-proof-thumbnail"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={formData.imageProof}
                alt="Task completion proof"
                className="thumbnail-image"
              />
              <div className="image-overlay">
                <Expand size={20} />
              </div>
            </button>
            <div className="image-proof-info">
              <div className="image-proof-header">
                <Camera size={16} />
                <span className="image-proof-label">Image Proof Available</span>
                {formData.completionVerified && (
                  <CheckCircle size={16} />
                )}
              </div>
              <p className="image-proof-text">
                Tap to view full image
              </p>
              
              <div className="verification-container">
                <div className="verification-toggle">
                  <div className="verification-info">
                    {formData.completionVerified ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <Shield size={18} />
                    )}
                    <span className="verification-label">
                      Admin Verification
                    </span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.completionVerified}
                      onChange={(e) => handleVerificationToggle(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="verification-status-indicator">
                  <div className={`status-dot ${formData.completionVerified ? 'verified' : 'unverified'}`} />
                  <span className={`verification-description ${formData.completionVerified ? 'verified' : 'unverified'}`}>
                    {formData.completionVerified 
                      ? "✓ Verified - Task automatically marked as COMPLETED"
                      : "⚠ Unverified - Task status set to PENDING"
                    }
                  </span>
                </div>
                <p className="verification-note">
                  Note: Verifying this image proof will automatically change the task status to "Completed". 
                  Removing verification will set the status to "Pending".
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-image-proof-container">
            <Camera size={24} />
            <p className="no-image-proof-text">No image proof provided</p>
            <p className="no-verification-note">Cannot verify task completion without image proof</p>
          </div>
        )}
      </div>
    );
  };

  const CompletionInfoSection = () => {
    if (!editingTask) return null;

    return (
      <div className="form-group">
        <label className="form-label">Task Status Overview</label>
        <div className="completion-info-container">
          <div className="completion-info-row">
            {formData.status === 'Completed' ? (
              <CheckCircle size={16} />
            ) : (
              <Clock size={16} />
            )}
            <span className={`completion-info-text ${formData.status === 'Completed' ? 'completed' : 'pending'}`}>
              Current Status: {formData.status}
            </span>
          </div>

          {formData.completedAt && (
            <div className="completion-info-row">
              <Clock size={16} />
              <span className="completion-info-text">
                Completed: {formatDateTime(formData.completedAt)}
              </span>
            </div>
          )}
          
          <div className="completion-info-row">
            {formData.completionVerified ? (
              <ShieldCheck size={16} />
            ) : (
              <Shield size={16} />
            )}
            <span className={`completion-info-text ${formData.completionVerified ? 'verified' : 'unverified'}`}>
              Verification: {formData.completionVerified ? "✓ Verified" : "⏳ Pending"}
            </span>
          </div>
          
          <div className="completion-info-row">
            <Camera size={16} />
            <span className={`completion-info-text ${formData.imageProof ? 'available' : 'unavailable'}`}>
              Image Proof: {formData.imageProof ? "Available" : "Not Provided"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CustomDropdown = ({ title, value, onValueChange, options, placeholder, fieldKey }) => {
    const isOpen = showDropdown === fieldKey;
    const selectedOption = options.find(opt => (opt.value || opt) === value);

    return (
      <div className="form-group">
        <label className="form-label">{title}</label>
        <button
          type="button"
          className={`dropdown-button ${isOpen ? 'open' : ''}`}
          onClick={() => setShowDropdown(isOpen ? null : fieldKey)}
        >
          <div className="dropdown-button-content">
            {selectedOption?.icon && (
              <selectedOption.icon size={20} className="dropdown-icon" />
            )}
            <span className={!value ? 'placeholder-text' : ''}>
              {selectedOption?.label || value || placeholder}
            </span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isOpen && (
          <div className="dropdown-list">
            {options.map((item, index) => (
              <button
                key={`${fieldKey}-${index}`}
                type="button"
                className={`dropdown-item ${(item.value || item) === value ? 'selected' : ''}`}
                onClick={() => {
                  onValueChange(item.value || item);
                  setShowDropdown(null);
                }}
              >
                {item.icon && (
                  <item.icon size={18} className="dropdown-item-icon" />
                )}
                <span className="dropdown-item-text">
                  {item.label || item}
                </span>
                {(item.value || item) === value && (
                  <CheckCircle size={18} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TimePickerInput = ({ value, onValueChange, index }) => (
    <div className="time-picker-container">
      <select
        className="time-picker-select"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select time</option>
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {formatTime(option.value)}
          </option>
        ))}
      </select>
    </div>
  );

  if (!showTaskModal) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">
              {editingTask ? 'Edit Task' : 'Assign Task'}
            </h2>
            <button onClick={handleClose} className="close-button">
              <X size={24} />
            </button>
          </div>

          <VerificationStatusButton />

          <div className="modal-content">
            {/* Task Type */}
            <CustomDropdown
              title="Task Type *"
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              options={taskTypes}
              placeholder="Select task type"
              fieldKey="taskType"
            />

            {/* Animal */}
            <CustomDropdown
              title="Animal *"
              value={formData.animal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, animal: value }))}
              options={animals.map(animal => ({ value: animal._id, label: animal.name, icon: Heart }))}
              placeholder={animals.length > 0 ? 'Select animal' : 'No animals available'}
              fieldKey="animal"
            />

            {/* Assigned To */}
            <CustomDropdown
              title="Assigned To *"
              value={formData.assignedTo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
              options={users.map(user => ({ value: user._id, label: user.name, icon: User }))}
              placeholder={users.length > 0 ? 'Select user' : 'No users available'}
              fieldKey="assignedTo"
            />

            {/* Show warning if no data */}
            {(users.length === 0 || animals.length === 0) && (
              <div className="warning-container">
                <AlertCircle size={20} />
                <span className="warning-text">
                  {users.length === 0 && animals.length === 0
                    ? 'No users or animals available. Please add some first.'
                    : users.length === 0
                    ? 'No users available. Please add users first.'
                    : 'No animals available. Please add animals first.'}
                </span>
              </div>
            )}

            {/* Recurring Task Toggle */}
            <div className="form-group">
              <div className="switch-container">
                <Repeat size={20} />
                <span className="switch-label">Make this a recurring task</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, isRecurring: e.target.checked }));
                      showToast('info', e.target.checked ? 'Recurring task enabled' : 'Single task selected');
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Schedule Date */}
            <div className="form-group">
              <label className="form-label">Schedule Date *</label>
              <div className="date-picker-container">
                <Calendar size={20} className="date-icon" />
                <input
                  type="date"
                  className="date-input"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Recurrence Pattern (only if recurring) */}
            {formData.isRecurring && (
              <>
                <CustomDropdown
                  title="Recurrence Pattern *"
                  value={formData.recurrencePattern}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, recurrencePattern: value }))}
                  options={recurrenceOptions}
                  placeholder="Select pattern"
                  fieldKey="recurrencePattern"
                />

                {/* End Date */}
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <div className="date-picker-container">
                    <Calendar size={20} className="date-icon" />
                    <input
                      type="date"
                      className="date-input"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Schedule Times */}
            <div className="form-group">
              <label className="form-label">Schedule Times *</label>
              {formData.scheduleTimes.map((time, index) => (
                <div key={index} className="time-slot-container">
                  <div className="time-input-container">
                    <TimePickerInput
                      value={time}
                      onValueChange={(value) => handleTimeChange(index, value)}
                      index={index}
                    />
                  </div>
                  {formData.scheduleTimes.length > 1 && (
                    <button
                      type="button"
                      className="remove-time-button"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <Minus size={24} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-time-button" onClick={addTimeSlot}>
                <Plus size={20} />
                <span>Add Another Time</span>
              </button>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              {formData.imageProof ? (
                <div className="status-readonly-container">
                  <div className="status-readonly-content">
                    {formData.status === 'Completed' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                    <span className={`status-readonly-text ${formData.status === 'Completed' ? 'completed' : 'pending'}`}>
                      {formData.status}
                    </span>
                  </div>
                  <p className="status-readonly-note">
                    Status is automatically controlled by verification
                  </p>
                </div>
              ) : (
                <CustomDropdown
                  title=""
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  options={statusOptions}
                  placeholder="Select status"
                  fieldKey="status"
                />
              )}
            </div>

            <ImageProofSection />
            <CompletionInfoSection />
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="button cancel-button"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button submit-button"
              onClick={handleSubmit}
              disabled={submitting || users.length === 0 || animals.length === 0}
            >
              {submitting ? (
                <div className="spinner small"></div>
              ) : (
                `${editingTask ? 'Update' : 'Assign'} Task`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Proof Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3 className="image-modal-title">Task Completion Proof</h3>
              <button onClick={() => setShowImageModal(false)}>
                <X size={24} />
              </button>
            </div>
            {formData.imageProof && (
              <img
                src={formData.imageProof}
                alt="Task completion proof"
                className="full-size-image"
              />
            )}
            <div className="image-modal-footer">
              <div className="image-modal-info">
                <Info size={16} />
                <span>Tap outside to close</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              <div className="toast-header">
                {toast.type === 'success' && <CheckCircle size={16} />}
                {toast.type === 'error' && <AlertCircle size={16} />}
                {toast.type === 'warning' && <AlertCircle size={16} />}
                {toast.type === 'info' && <Info size={16} />}
                <span className="toast-title">{toast.text1}</span>
              </div>
              {toast.text2 && <p className="toast-description">{toast.text2}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskModal;