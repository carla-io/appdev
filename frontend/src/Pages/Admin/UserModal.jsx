import React, { useState } from 'react';

const UserModal = ({ setShowUserModal, users, setUsers }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.role) {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      setUsers(prev => [...prev, newUser]);
      setShowUserModal(false);
      setFormData({ name: '', email: '', role: '' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">Add New User</h3>
        <div className="form-group">
          <input 
            type="text" 
            name="name"
            placeholder="Full Name" 
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
          />
          <select 
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="vet">Veterinarian</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="modal-actions">
          <button 
            onClick={() => setShowUserModal(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;