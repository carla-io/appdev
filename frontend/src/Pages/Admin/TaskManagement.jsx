import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Plus, Menu, User, Clock, Repeat, CheckCircle, Camera, Expand, Check, Edit, Trash2, X } from 'lucide-react';
import TaskModal from './TaskModal'; // Import the TaskModal component
import '../CSS/TaskManagement.css'; // Import the CSS for Task Management

// API base URL
const API_BASE_URL = 'http://localhost:5000';

const TaskManagement = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!showTaskModal) {
      fetchTasks();
      // Clear editing task when modal closes
      if (editingTask) {
        setEditingTask(null);
      }
    }
  }, [showTaskModal]);

  const showToast = (type, text1, text2 = '') => {
    setToastMessage({ type, text1, text2 });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTasks = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks/getAll`);
      const data = await response.json();
      setTasks(data);
      
      if (showSuccessMessage) {
        showToast('success', 'Tasks refreshed successfully!');
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      showToast('error', 'Failed to load tasks', 'Please refresh the page.');
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
        showToast('error', 'Task not found');
        return;
      }

      const newStatus = task.status.toLowerCase() === 'completed' ? 'Pending' : 'Completed';

      const updateData = {
        ...task,
        status: newStatus
      };

      if (newStatus === 'Completed') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      const response = await fetch(`${API_BASE_URL}/tasks/edit/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      if (newStatus === 'Completed') {
        showToast('success', 'Task completed!', `"${task.type}" for ${task.animalId?.name || 'Unknown'}`);
      } else {
        showToast('info', 'Task marked as pending', `"${task.type}" for ${task.animalId?.name || 'Unknown'}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast('error', 'Failed to update task', 'Please try again.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
    showToast('info', 'Editing task', `${task.type} for ${task.animalId?.name || 'Unknown'}`);
  };

  const handleAddTask = () => {
    setEditingTask(null); // Clear any existing editing task
    setShowTaskModal(true);
    showToast('info', 'Adding new task');
  };

  const handleDeleteTask = (taskId, taskType) => {
    const task = tasks.find(t => t._id === taskId);
    const animalName = task?.animalId?.name || 'Unknown';
    
    if (window.confirm(`Are you sure you want to delete this ${taskType} task for ${animalName}?`)) {
      const deleteTask = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete task');
          }

          fetchTasks();
          showToast('success', 'Task deleted', `"${taskType}" for ${animalName} deleted successfully!`);
        } catch (error) {
          console.error('Failed to delete task:', error);
          showToast('error', 'Failed to delete task', 'Please try again.');
        }
      };
      
      deleteTask();
    }
  };

  const handleViewImage = (imageUri) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };

  const formatDateTime = (date, times) => {
    if (!date && (!times || times.length === 0)) return 'Not set';
    
    let result = '';
    
    if (date) {
      const taskDate = new Date(date);
      result = taskDate.toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }

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

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  const TaskCard = ({ task }) => (
    <div className="task-card">
      <div className="task-header">
        <div className="task-info">
          <h3 className="task-type">{task.type}</h3>
          <p className="animal-name">{task.animalId?.name || 'Unknown Animal'}</p>
        </div>
        <div className={`status-badge ${task.status?.toLowerCase() === 'completed' ? 'completed' : 'pending'}`}>
          <span className="status-text">{task.status}</span>
        </div>
      </div>
      
      <div className="task-details">
        <p className="assigned-to">
          <User size={14} />
          Assigned to: {task.assignedTo?.name || 'Unknown User'}
        </p>
        <p className="schedule-time">
          <Clock size={14} />
          {formatDateTime(task.scheduleDate, task.scheduleTimes)}
        </p>
        {task.isRecurring && (
          <p className="recurring-info">
            <Repeat size={14} />
            Recurring: {task.recurrencePattern}
          </p>
        )}
        {task.completionVerified && (
          <p className="verified-info">
            <CheckCircle size={14} />
            Completion Verified
          </p>
        )}
      </div>

      {task.imageProof && (
        <div className="image-proof-section">
          <p className="image-proof-label">
            <Camera size={14} />
            Completion Proof:
          </p>
          <div className="image-proof-container" onClick={() => handleViewImage(task.imageProof)}>
            <img 
              src={task.imageProof} 
              alt="Completion proof"
              className="image-proof-thumbnail"
            />
            <div className="image-overlay">
              <Expand size={20} />
            </div>
          </div>
        </div>
      )}
      
      <div className="task-actions">
        <button
          className="action-button complete-button"
          onClick={() => handleCompleteTask(task._id)}
        >
          {task.status?.toLowerCase() === 'completed' ? <RefreshCw size={18} /> : <Check size={18} />}
          <span>{task.status?.toLowerCase() === 'completed' ? 'Undo' : 'Complete'}</span>
        </button>
        
        <button
          className="action-button edit-button"
          onClick={() => handleEditTask(task)}
        >
          <Edit size={18} />
          <span>Edit</span>
        </button>
        
        <button
          className="action-button delete-button"
          onClick={() => handleDeleteTask(task._id, task.type)}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="task-management-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Task Management</h1>
          <button 
            onClick={handleAddTask}
            className="add-button"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="search-container">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks, animals, or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setFilterModalVisible(true)}
          className="filter-button"
        >
          <Filter size={20} />
        </button>
        <button 
          onClick={handleRefresh}
          className="refresh-button"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Tasks List */}
      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading tasks...</p>
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">📋</div>
                <h3 className="empty-text">No tasks found</h3>
                <p className="empty-subtext">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'Add your first task to get started'
                  }
                </p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal 
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      {/* Filter Modal */}
      {filterModalVisible && (
        <div className="modal-overlay" onClick={() => setFilterModalVisible(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-header">
              <h2 className="filter-title">Filter Tasks</h2>
              <button onClick={() => setFilterModalVisible(false)} className="close-button">
                <X size={24} />
              </button>
            </div>
            
            <div className="filter-content">
              <h3 className="filter-section-title">Status</h3>
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  className={`filter-option ${statusFilter === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setFilterModalVisible(false);
                    showToast('info', 'Filter applied', `Showing ${option.label.toLowerCase()} tasks`);
                  }}
                >
                  <span className="filter-option-text">{option.label}</span>
                  {statusFilter === option.value && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalVisible && (
        <div className="image-modal-overlay" onClick={() => setImageModalVisible(false)}>
          <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h2 className="image-modal-title">Completion Proof</h2>
              <button 
                onClick={() => setImageModalVisible(false)}
                className="image-modal-close-button"
              >
                <X size={24} />
              </button>
            </div>
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Completion proof"
                className="full-size-image"
              />
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className={`toast toast-${toastMessage.type}`}>
          <div className="toast-content">
            <strong>{toastMessage.text1}</strong>
            {toastMessage.text2 && <p>{toastMessage.text2}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;