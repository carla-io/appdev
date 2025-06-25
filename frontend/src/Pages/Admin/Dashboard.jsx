import React from 'react';
import { Users, Activity, Clock, CheckCircle, Download } from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = ({ users, animals, tasks }) => {
  const dashboardStats = {
    totalUsers: users.length,
    totalAnimals: animals.length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Download className="nav-icon" />
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value={dashboardStats.totalUsers} 
          icon={Users} 
          iconClass="blue"
          trend="+12%"
        />
        <StatCard 
          title="Animals" 
          value={dashboardStats.totalAnimals} 
          icon={Activity} 
          iconClass="green"
          trend="+8%"
        />
        <StatCard 
          title="Pending Tasks" 
          value={dashboardStats.pendingTasks} 
          icon={Clock} 
          iconClass="orange"
        />
        <StatCard 
          title="Completed Tasks" 
          value={dashboardStats.completedTasks} 
          icon={CheckCircle} 
          iconClass="purple"
          trend="+24%"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
          </div>
          <div className="card-content">
            <div className="task-list">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.type.replace('_', ' ')}</h4>
                    <p>{task.animal} - {task.assignedTo}</p>
                  </div>
                  <span className={`badge ${
                    task.status === 'completed' ? 'badge-green' : 'badge-orange'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Activity</h3>
          </div>
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-indicator green"></div>
                <div className="activity-content">
                  <p className="activity-title">New user registered</p>
                  <p className="activity-time">2 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-indicator blue"></div>
                <div className="activity-content">
                  <p className="activity-title">Task completed by Dr. Johnson</p>
                  <p className="activity-time">15 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-indicator orange"></div>
                <div className="activity-content">
                  <p className="activity-title">Scheduled maintenance reminder</p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;