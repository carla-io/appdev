import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, Edit3, Eye, Trash2, X } from 'lucide-react';
import '../CSS/User.css'; // Import your CSS styles

const UserManagement = ({ setShowUserModal }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    userType: [],
    status: []
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Using fetch instead of axios to avoid external dependencies
        const response = await fetch('http://localhost:5000/user/getAll');
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      userType: [],
      status: []
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = selectedFilters.userType.length === 0 || 
      selectedFilters.userType.includes(user.userType);
    
    const matchesStatus = selectedFilters.status.length === 0 || 
      selectedFilters.status.includes(user.status || 'active');
    
    return matchesSearch && matchesUserType && matchesStatus;
  });

  const hasActiveFilters = selectedFilters.userType.length > 0 || selectedFilters.status.length > 0;

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
            <div className="filter-container">
              <button 
                className={`btn btn-outline ${hasActiveFilters ? 'btn-active' : ''}`}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="nav-icon" />
                Filter
                {hasActiveFilters && (
                  <span className="filter-count">
                    {selectedFilters.userType.length + selectedFilters.status.length}
                  </span>
                )}
              </button>
              
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-section">
                    <div className="filter-header">
                      <h4>User Type</h4>
                    </div>
                    <div className="filter-options">
                      {['user', 'admin', 'vet'].map(type => (
                        <label key={type} className="filter-option">
                          <input
                            type="checkbox"
                            checked={selectedFilters.userType.includes(type)}
                            onChange={() => handleFilterChange('userType', type)}
                          />
                          <span className="checkmark"></span>
                          <span className="filter-label">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="filter-section">
                    <div className="filter-header">
                      <h4>Status</h4>
                    </div>
                    <div className="filter-options">
                      {['active', 'inactive'].map(status => (
                        <label key={status} className="filter-option">
                          <input
                            type="checkbox"
                            checked={selectedFilters.status.includes(status)}
                            onChange={() => handleFilterChange('status', status)}
                          />
                          <span className="checkmark"></span>
                          <span className="filter-label">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="filter-actions">
                    <button 
                      className="btn btn-text"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="active-filters">
              {selectedFilters.userType.map(type => (
                <span key={type} className="filter-tag">
                  User Type: {type}
                  <button 
                    onClick={() => handleFilterChange('userType', type)}
                    className="filter-tag-remove"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {selectedFilters.status.map(status => (
                <span key={status} className="filter-tag">
                  Status: {status}
                  <button 
                    onClick={() => handleFilterChange('status', status)}
                    className="filter-tag-remove"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {users.length === 0 ? 'Loading users...' : 'No users found matching your criteria'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
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
                    {/* <td>
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
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

     
    </div>
  );
};

export default UserManagement;