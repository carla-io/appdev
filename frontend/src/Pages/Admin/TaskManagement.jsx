import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { PlusCircle, Edit3, CheckCircle, Search, Filter, Calendar, Trash2, RefreshCw } from 'lucide-react';
import '../CSS/TaskManagement.css';
import 'react-toastify/dist/ReactToastify.css';

const TaskManagement = ({ setShowTaskModal, setEditingTask }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/tasks/getAll');
      setTasks(res.data);
      
      if (showSuccessMessage) {
        toast.success('Tasks refreshed successfully!');
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err.response?.data?.message) {
        toast.error(`Failed to load tasks: ${err.response.data.message}`);
      } else {
        toast.error('Failed to load tasks. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTasks(true);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) {
        toast.error('Task not found.');
        return;
      }

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

      // Show success notification
      if (newStatus === 'Completed') {
        toast.success(`✅ Task "${task.type}" for ${task.animalId?.name || 'Unknown'} marked as completed!`);
      } else {
        toast.info(`🔄 Task "${task.type}" for ${task.animalId?.name || 'Unknown'} marked as pending`);
      }

      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Failed to update task:', error);
      if (error.response?.data?.message) {
        toast.error(`❌ Failed to update task: ${error.response.data.message}`);
      } else {
        toast.error('❌ Failed to update task. Please try again.');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
    toast.info(`✏️ Editing task: ${task.type} for ${task.animalId?.name || 'Unknown'}`);
  };

  const handleDeleteTask = async (taskId, taskType) => {
    const task = tasks.find(t => t._id === taskId);
    const animalName = task?.animalId?.name || 'Unknown';
    
    // Use toast.dismiss() to clear any existing toasts before showing the confirmation
    toast.dismiss();
    
    // Create a custom toast with confirmation buttons
    const confirmToast = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this <strong>{taskType}</strong> task for <strong>{animalName}</strong>?</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={async () => {
                closeToast();
                try {
                  await axios.delete(`http://localhost:5000/tasks/delete/${taskId}`);
                  fetchTasks(); // Refresh task list
                  toast.success(`🗑️ Task "${taskType}" for ${animalName} deleted successfully!`);
                } catch (error) {
                  console.error('Failed to delete task:', error);
                  if (error.response?.data?.message) {
                    toast.error(`❌ Failed to delete task: ${error.response.data.message}`);
                  } else {
                    toast.error('❌ Failed to delete task. Please try again.');
                  }
                }
              }}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: 'delete-confirmation-toast'
      }
    );
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`nav-icon ${loading ? 'spin' : ''}`} />
            Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowTaskModal(true);
              toast.info('📝 Opening task assignment form...');
            }}
          >
            <PlusCircle className="nav-icon" />
            Assign Task
          </button>
        </div>
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
          {loading ? (
            <div className="empty-state">
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
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
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleEditTask(task)}
                          title="Edit Task"
                        >
                          <Edit3 />
                        </button>
                        <button 
                          className="action-btn complete" 
                          onClick={() => handleCompleteTask(task._id)}
                          title={task.status?.toLowerCase() === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                        >
                          <CheckCircle />
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteTask(task._id, task.type)}
                          title="Delete Task"
                        >
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

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default TaskManagement;