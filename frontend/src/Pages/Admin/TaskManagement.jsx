import React from 'react';
import { PlusCircle, Edit3, CheckCircle } from 'lucide-react';

const TaskManagement = ({ tasks, setTasks, setShowTaskModal }) => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <button 
          onClick={() => setShowTaskModal(true)}
          className="btn btn-primary"
        >
          <PlusCircle className="nav-icon" />
          Assign Task
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Animal</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#315342', textTransform: 'capitalize' }}>
                      {task.type.replace('_', ' ')}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#315342' }}>{task.animal}</td>
                  <td style={{ fontSize: '0.875rem', color: '#315342' }}>{task.assignedTo}</td>
                  <td style={{ fontSize: '0.875rem', color: '#315342' }}>{task.dueDate}</td>
                  <td>
                    <span className={`badge ${
                      task.status === 'completed' ? 'badge-green' : 'badge-orange'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">
                        <Edit3 />
                      </button>
                      <button className="action-btn complete">
                        <CheckCircle />
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

export default TaskManagement;