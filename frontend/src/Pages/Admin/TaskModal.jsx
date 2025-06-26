import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, User, FileText, Tag } from 'lucide-react';

const TaskModal = ({ showTaskModal, setShowTaskModal, setEditingTask, editingTask }) => {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [formData, setFormData] = useState({
    type: '',
    animal: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending'
  });

  useEffect(() => {
    // Fetch users with userType: 'user'
   axios.get('http://localhost:5000/user/getAllUsersOnly')
  .then(res => setUsers(res.data.users)) // ✅ extract users array
  .catch(err => console.error('Error fetching users:', err));


    // Fetch animals
    axios.get('http://localhost:5000/animal/getAll')
  .then(res => setAnimals(res.data.animals)) // ✅ fix here
  .catch(err => console.error('Error fetching animals:', err));

  }, []);

  useEffect(() => {
  if (editingTask) {
    setFormData({
      type: editingTask.type || '',
      animal: editingTask.animalId?._id || editingTask.animalId || '',
      assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || '',
      dueDate: editingTask.scheduleDate ? new Date(editingTask.scheduleDate).toISOString().split('T')[0] : '',
      status: editingTask.status || 'Pending'
    });
  } else {
    setFormData({
      type: '',
      animal: '',
      assignedTo: '',
      dueDate: '',
      status: 'Pending'
    });
  }
}, [editingTask]);



  const taskTypes = [
    'Feeding', 'Cleaning', 'Health Check', 'Medication', 'Observation', 'Weight Monitoring'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.type || !formData.animal || !formData.assignedTo || !formData.dueDate) {
    return alert('Please fill all required fields.');
  }

  const payload = {
    type: formData.type,
    animalId: formData.animal,
    assignedTo: formData.assignedTo,
    scheduleDate: formData.dueDate,
    status: formData.status,
  };

  try {
    if (editingTask) {
      // 🔁 Edit Task
      await axios.put(`http://localhost:5000/tasks/edit/${editingTask._id}`, payload);
      alert('Task updated!');
    } else {
      // 🆕 Create Task
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
    setFormData({ type: '', animal: '', assignedTo: '', dueDate: '', status: 'pending' });
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
                <option key={type} value={type}>
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
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
            <label className="form-label"><Calendar size={16} /> Due Date *</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
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
