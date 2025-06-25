import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Filter, Edit3, Eye, Trash2 } from 'lucide-react';

const UserManagement = ({ setShowUserModal }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/getAll');
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-container">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="btn btn-outline">
              <Filter className="nav-icon" />
              Filter
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => 
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                  <tr key={user._id}>
                    <td>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#315342' }}>{user.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.userType === 'admin' ? 'badge-purple' :
                        user.userType === 'vet' ? 'badge-blue' :
                        'badge-gray'
                      }`}>
                        {user.userType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.status === 'active' ? 'badge-green' : 'badge-orange'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit">
                          <Edit3 />
                        </button>
                        <button className="action-btn view">
                          <Eye />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
