import React, { useState } from 'react';
import '../CSS/AdminDashboard.css';
import { 
  Users, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  Clock,
  Activity,
  FileText,
  LogOut,
  BarChart3,
  Download,
  Shield
} from 'lucide-react';

// Import separate components
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import AnimalProfiles from './AnimalProfiles';
import TaskManagement from './TaskManagement';
import UserModal from './UserModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@email.com', role: 'vet', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Mike Wilson', email: 'mike@email.com', role: 'user', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Dr. Emily Chen', email: 'emily@email.com', role: 'vet', status: 'pending', joinDate: '2024-03-10' },
  ]);
  
  const [animals, setAnimals] = useState([
    { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, owner: 'Mike Wilson', status: 'healthy' },
    { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian', age: 2, owner: 'Sarah Johnson', status: 'needs_checkup' },
    { id: 3, name: 'Rex', species: 'Dog', breed: 'German Shepherd', age: 5, owner: 'Mike Wilson', status: 'healthy' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, type: 'feeding', animal: 'Buddy', assignedTo: 'Dr. Sarah Johnson', dueDate: '2024-06-23', status: 'pending' },
    { id: 2, type: 'vet_check', animal: 'Whiskers', assignedTo: 'Dr. Emily Chen', dueDate: '2024-06-22', status: 'completed' },
    { id: 3, type: 'cleaning', animal: 'Rex', assignedTo: 'Mike Wilson', dueDate: '2024-06-24', status: 'pending' },
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard users={users} animals={animals} tasks={tasks} />;
      case 'users': 
        return <UserManagement 
          users={users} 
          setUsers={setUsers}
          setShowUserModal={setShowUserModal} 
        />;
      case 'animals': 
        return <AnimalProfiles 
          animals={animals} 
          setAnimals={setAnimals}
          setShowAnimalModal={setShowAnimalModal} 
        />;
      case 'tasks': 
        return <TaskManagement 
          tasks={tasks} 
          setTasks={setTasks}
          setShowTaskModal={setShowTaskModal} 
        />;
      case 'schedules': 
        return <div className="coming-soon"><p>Schedules management coming soon...</p></div>;
      case 'logs': 
        return <div className="coming-soon"><p>Health logs coming soon...</p></div>;
      case 'reports': 
        return <div className="coming-soon"><p>Reports generation coming soon...</p></div>;
      case 'audit': 
        return <div className="coming-soon"><p>Audit logs coming soon...</p></div>;
      default: 
        return <Dashboard users={users} animals={animals} tasks={tasks} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
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
                onClick={() => setActiveTab(item.id)}
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
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}>
            <LogOut className="nav-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-area">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserModal 
          setShowUserModal={setShowUserModal}
          users={users}
          setUsers={setUsers}
        />
      )}
    </div>
  );
};

export default AdminDashboard;