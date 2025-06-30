import React, { useState } from 'react';
import '../CSS/AdminDashboard.css';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle,
  Activity,
  FileText,
  LogOut,
  BarChart3,
  Download,
  Shield,
} from 'lucide-react';

import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import AnimalProfiles from './AnimalProfiles';
import TaskManagement from './TaskManagement';
import TaskModal from './TaskModal';
import Schedule from './Schedule';
import UserModal from './UserManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const activeTab = location.pathname.split('/')[2] || 'dashboard';

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'animals', label: 'Animal Profiles', icon: Activity },
    { id: 'tasks', label: 'Task Management', icon: CheckCircle },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'logs', label: 'Health Logs', icon: FileText },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
  ];

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Captivity & Care</h2>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/admin/${item.id}`)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span>A</span>
            </div>
            <div>
              <p className="user-name">Admin User</p>
              <p className="user-email">admin@example.com</p>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            <LogOut className="nav-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-area">
          <Routes>
            <Route index element={<Dashboard users={users} animals={animals} tasks={tasks} />} />
            <Route path="dashboard" element={<Dashboard users={users} animals={animals} tasks={tasks} />} />
            <Route path="users" element={<UserManagement users={users} setUsers={setUsers} setShowUserModal={setShowUserModal} />} />
            <Route path="animals" element={<AnimalProfiles animals={animals} setAnimals={setAnimals} setShowAnimalModal={setShowAnimalModal} />} />
            <Route path="tasks" element={<TaskManagement tasks={tasks} setTasks={setTasks} setShowTaskModal={setShowTaskModal} setEditingTask={setEditingTask} />} />
            <Route path="schedules" element={<Schedule users={users} animals={animals} tasks={tasks} />} />
            <Route path="logs" element={<div className="coming-soon"><p>Health logs coming soon...</p></div>} />
            <Route path="reports" element={<div className="coming-soon"><p>Reports generation coming soon...</p></div>} />
            <Route path="audit" element={<div className="coming-soon"><p>Audit logs coming soon...</p></div>} />
          </Routes>
        </div>
      </div>

      {showUserModal && (
        <UserModal setShowUserModal={setShowUserModal} users={users} setUsers={setUsers} />
      )}

      {showTaskModal && (
        <TaskModal
          showTaskModal={showTaskModal}
          setShowTaskModal={setShowTaskModal}
          tasks={tasks}
          setTasks={setTasks}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />
      )}
    </div>
  );
};

export default AdminDashboard;