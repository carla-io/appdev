import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit3, CheckCircle, Search, Filter } from 'lucide-react';
import '../CSS/TaskManagement.css';

const TaskManagement = ({ setShowTaskModal, setEditingTask }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch tasks from backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks/getAll')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, []);

  const handleCompleteTask = (taskId) => {
    setTasks(prev => prev.map(task =>
      task._id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
    // Optional: Send update to backend
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const filteredTasks = tasks.filter(task => {
  const searchValue = searchTerm.toLowerCase();
  const matchesSearch =
    task.animalId?.name?.toLowerCase().includes(searchValue) ||
    task.assignedTo?.name?.toLowerCase().includes(searchValue) ||
    task.type?.toLowerCase().includes(searchValue);
  const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter;
  return matchesSearch && matchesStatus;
});


  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <button onClick={() => {
          setEditingTask(null);
          setShowTaskModal(true);
        }} className="btn btn-primary">
          <PlusCircle className="nav-icon" />
          Assign Task
        </button>
      </div>

      <div className="controls-section">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input" />
        </div>
        <div className="filter-container">
          <Filter size={16} className="filter-icon" />
          <select value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state"><p>No tasks found.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th><th>Animal</th><th>Assigned To</th><th>Due Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredTasks.map(task => (
    <tr key={task._id}>
      <td>{task.type}</td>
      <td>{task.animalId?.name || 'Unknown'}</td>
      <td>{task.assignedTo?.name || 'Unknown'}</td>
      <td>{new Date(task.scheduleDate).toLocaleDateString()}</td>
      <td>
        <span className={`badge ${task.status === 'Completed' ? 'badge-green' : 'badge-orange'}`}>
          {task.status}
        </span>
      </td>
      <td>
        <div className="action-buttons">
          <button className="action-btn edit" onClick={() => handleEditTask(task)}><Edit3 /></button>
          <button className="action-btn complete" onClick={() => handleCompleteTask(task._id)}><CheckCircle /></button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
