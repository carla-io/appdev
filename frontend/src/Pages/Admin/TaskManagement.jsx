import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit3, CheckCircle, Search, Filter, Calendar, Trash2 } from 'lucide-react';
import '../CSS/TaskManagement.css';

const TaskManagement = ({ setShowTaskModal, setEditingTask }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks/getAll');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const newStatus = task.status.toLowerCase() === 'completed' ? 'Pending' : 'Completed';

      const updateData = {
        ...task,
        status: newStatus
      };

      // Add completedAt timestamp when marking as completed
      if (newStatus === 'Completed') {
        updateData.completedAt = new Date();
      } else {
        // Remove completedAt when marking as pending
        updateData.completedAt = null;
      }

      await axios.put(`http://localhost:5000/tasks/edit/${taskId}`, updateData);

      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId, taskType) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${taskType} task? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/tasks/delete/${taskId}`);
      fetchTasks(); // Refresh task list
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const formatDateTime = (date, times) => {
    if (!date && (!times || times.length === 0)) return 'Not set';
    
    let result = '';
    
    // Format date
    if (date) {
      const taskDate = new Date(date);
      result = taskDate.toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }

    // Format times
    if (times && times.length > 0) {
      const formattedTimes = times.map(time => {
        const timeDate = new Date(`1970-01-01T${time}`);
        return timeDate.toLocaleTimeString([], {
          hour: '2-digit', 
          minute: '2-digit'
        });
      }).join(', ');
      
      if (result) {
        result += ` at ${formattedTimes}`;
      } else {
        result = formattedTimes;
      }
    }

    return result || 'Not set';
  };

  const filteredTasks = tasks.filter(task => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      task.animalId?.name?.toLowerCase().includes(searchValue) ||
      task.assignedTo?.name?.toLowerCase().includes(searchValue) ||
      task.type?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === 'all' || task.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setShowTaskModal(true);
          }}
        >
          <PlusCircle className="nav-icon" />
          Assign Task
        </button>
      </div>

      <div className="controls-section">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter size={16} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Animal</th>
                  <th>Assigned To</th>
                  <th>Schedule</th>
                  <th>Recurring</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task._id}>
                    <td>{task.type}</td>
                    <td>{task.animalId?.name || 'Unknown'}</td>
                    <td>{task.assignedTo?.name || 'Unknown'}</td>
                    <td>{formatDateTime(task.scheduleDate, task.scheduleTimes)}</td>
                    <td>
                      {task.isRecurring ? (
                        <div className="recurring-info">
                          <Calendar size={16} className="recurring-icon" />
                          <span>{task.recurrencePattern}</span>
                          {task.endDate && (
                            <span className="recurring-range">
                              {' '}until {new Date(task.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="no-recurring">No</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${task.status?.toLowerCase() === 'completed' ? 'badge-green' : 'badge-orange'}`}>
                        {task.status}
                      </span>
                      {task.completedAt && (
                        <div className="completed-time">
                          {new Date(task.completedAt).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => handleEditTask(task)}>
                          <Edit3 />
                        </button>
                        <button className="action-btn complete" onClick={() => handleCompleteTask(task._id)}>
                          <CheckCircle />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteTask(task._id, task.type)}>
                          <Trash2 />
                        </button>
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