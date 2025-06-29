import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, User, FileText, Tag, Clock, Repeat, Plus, Minus } from 'lucide-react';

const TaskModal = ({ showTaskModal, setShowTaskModal, setEditingTask, editingTask }) => {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [formData, setFormData] = useState({
    type: '',
    animal: '',
    assignedTo: '',
    scheduleDate: '',
    scheduleTimes: [''],
    status: 'Pending',
    isRecurring: false,
    recurrencePattern: 'Daily',
    endDate: ''
  });

  useEffect(() => {
    // Fetch users with userType: 'user'
    axios.get('http://localhost:5000/user/getAllUsersOnly')
      .then(res => setUsers(res.data.users))
      .catch(err => console.error('Error fetching users:', err));

    // Fetch animals
    axios.get('http://localhost:5000/animal/getAll')
      .then(res => setAnimals(res.data.animals))
      .catch(err => console.error('Error fetching animals:', err));
  }, []);

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
        endDate: editingTask.endDate ? new Date(editingTask.endDate).toISOString().split('T')[0] : ''
      });
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
        endDate: ''
      });
    }
  }, [editingTask]);

  const taskTypes = [
    'Feeding', 'Cleaning', 'Health Check', 'Medication', 'Observation', 'Weight Monitoring'
  ];

  const recurrenceOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

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
  };

  const removeTimeSlot = (index) => {
    if (formData.scheduleTimes.length > 1) {
      const newTimes = formData.scheduleTimes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, scheduleTimes: newTimes }));
    }
  };

  const validateForm = () => {
    if (!formData.type || !formData.animal || !formData.assignedTo || !formData.scheduleDate) {
      alert('Please fill all required fields.');
      return false;
    }

    // For recurring tasks, require endDate
    if (formData.isRecurring && !formData.endDate) {
      alert('Please select an end date for recurring tasks.');
      return false;
    }

    // Validate that at least one time is provided and not empty
    const validTimes = formData.scheduleTimes.filter(time => time.trim() !== '');
    if (validTimes.length === 0) {
      alert('Please provide at least one schedule time.');
      return false;
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    const invalidTimes = validTimes.filter(time => !timeRegex.test(time));
    if (invalidTimes.length > 0) {
      alert('Please ensure all times are in HH:mm format.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Filter out empty times
    const validTimes = formData.scheduleTimes.filter(time => time.trim() !== '');

    const payload = {
      type: formData.type,
      animalId: formData.animal,
      assignedTo: formData.assignedTo,
      scheduleDate: formData.scheduleDate, // Always include scheduleDate
      scheduleTimes: validTimes,
      status: formData.status,
      isRecurring: formData.isRecurring
    };

    // Add recurring fields
    if (formData.isRecurring) {
      payload.recurrencePattern = formData.recurrencePattern;
      payload.endDate = formData.endDate;
    }

    try {
      if (editingTask) {
        // Edit Task
        await axios.put(`http://localhost:5000/tasks/edit/${editingTask._id}`, payload);
        alert('Task updated!');
      } else {
        // Create Task
        await axios.post('http://localhost:5000/tasks/add', payload);
        alert('Task added!');
      }

      handleClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to submit task:', err);
      alert('Something went wrong. Please check the input.');
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
      endDate: ''
    });
    setEditingTask(null);
    setShowTaskModal(false);
  };

  if (!showTaskModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingTask ? 'Edit Task' : 'Assign Task'}</h2>
          <button onClick={handleClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label"><Tag size={16} /> Task Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-input" required>
              <option value="">Select task type</option>
              {taskTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label"><FileText size={16} /> Animal *</label>
            <select name="animal" value={formData.animal} onChange={handleChange} className="form-input" required>
              <option value="">Select animal</option>
              {animals.map(animal => (
                <option key={animal._id} value={animal._id}>{animal.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label"><User size={16} /> Assigned To *</label>
            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="form-input" required>
              <option value="">Select user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="isRecurring" 
                name="isRecurring" 
                checked={formData.isRecurring} 
                onChange={handleChange}
                className="checkbox-input"
              />
              <label htmlFor="isRecurring" className="checkbox-label">
                <Repeat size={16} /> Make this a recurring task
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><Calendar size={16} /> Schedule Date *</label>
            <input 
              type="date" 
              name="scheduleDate" 
              value={formData.scheduleDate} 
              onChange={handleChange} 
              className="form-input" 
              required
            />
          </div>

          {formData.isRecurring && (
            <>
              <div className="form-group">
                <label className="form-label"><Repeat size={16} /> Recurrence Pattern *</label>
                <select 
                  name="recurrencePattern" 
                  value={formData.recurrencePattern} 
                  onChange={handleChange} 
                  className="form-input"
                  required={formData.isRecurring}
                >
                  {recurrenceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><Calendar size={16} /> End Date *</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  className="form-input" 
                  required={formData.isRecurring}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label"><Clock size={16} /> Schedule Times *</label>
            {formData.scheduleTimes.map((time, index) => (
              <div key={index} className="time-slot-group">
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="form-input time-input"
                  required={index === 0}
                />
                {formData.scheduleTimes.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeTimeSlot(index)}
                    className="btn btn-sm btn-danger time-remove-btn"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addTimeSlot}
              className="btn btn-sm btn-secondary add-time-btn"
            >
              <Plus size={16} /> Add Another Time
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{editingTask ? 'Update' : 'Assign'} Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;