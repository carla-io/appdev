import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, CheckCircle, Download, AlertCircle } from 'lucide-react';
import '../CSS/Dashboard.css'

const StatCard = ({ title, value, icon: Icon, iconClass, trend, loading }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className="stat-info">
        <h3>{title}</h3>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <p className="stat-value">{value}</p>
            {trend && <p className="stat-trend">↗ {trend}</p>}
          </>
        )}
      </div>
      <div className={`stat-icon ${iconClass}`}>
        <Icon />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
  users: 0,
  animals: 0,
  tasks: [],
  pendingTasks: 0,
  completedTasks: 0
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const [usersRes, animalsRes, tasksRes, pendingRes, completedRes] = await Promise.all([
      fetch('http://localhost:5000/user/countUsersOnly'),
      fetch('http://localhost:5000/animal/count'),
      fetch('http://localhost:5000/tasks/getAll'),
      fetch('http://localhost:5000/tasks/count/pending'),
      fetch('http://localhost:5000/tasks/count/completed')
    ]);

    if (!usersRes.ok || !animalsRes.ok || !tasksRes.ok || !pendingRes.ok || !completedRes.ok) {
      throw new Error('Failed to fetch data from one or more APIs');
    }

    const usersData = await usersRes.json();
    const animalsData = await animalsRes.json();
    const tasksData = await tasksRes.json();
    const pendingData = await pendingRes.json();
    const completedData = await completedRes.json();

    setData({
      users: usersData.count,
      animals: animalsData.count,
      tasks: tasksData,
      pendingTasks: pendingData.count,
      completedTasks: completedData.count
    });
  } catch (err) {
    setError(err.message);
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchData();
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

const dashboardStats = {
  totalUsers: data.users,
  totalAnimals: data.animals,
  pendingTasks: data.pendingTasks,
  completedTasks: data.completedTasks,
};




  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <AlertCircle className="error-icon" />
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="header-actions">
          <button onClick={fetchData} className="btn btn-secondary" disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
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
          loading={loading}
        />
        <StatCard 
          title="Animals" 
          value={dashboardStats.totalAnimals} 
          icon={Activity} 
          iconClass="green"
          trend="+8%"
          loading={loading}
        />
        <StatCard 
          title="Pending Tasks" 
          value={dashboardStats.pendingTasks} 
          icon={Clock} 
          iconClass="orange"
          loading={loading}
        />
        <StatCard 
          title="Completed Tasks" 
          value={dashboardStats.completedTasks} 
          icon={CheckCircle} 
          iconClass="purple"
          trend="+24%"
          loading={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : data.tasks.length === 0 ? (
              <p className="no-data">No tasks available</p>
            ) : (
              <div className="task-list">
                {data.tasks.slice(0, 5).map((task, index) => (
                  <div key={task.id || index} className="task-item">
                    <div className="task-info">
                      <h4>{task.type ? task.type.replace('_', ' ') : 'Task'}</h4>
                      <p>
  {(task.animalId && task.animalId.name) || 'Unknown Animal'} - {(task.assignedTo && task.assignedTo.name) || 'Unassigned'}
</p>

                    </div>
                    <span className={`badge ${
                      task.status === 'completed' ? 'badge-green' : 'badge-orange'
                    }`}>
                      {task.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                  <p className="activity-title">Data refreshed successfully</p>
                  <p className="activity-time">{loading ? 'Refreshing...' : 'Just now'}</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-indicator blue"></div>
                <div className="activity-content">
                  <p className="activity-title">Dashboard loaded</p>
                  <p className="activity-time">Connected to API</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-indicator orange"></div>
                <div className="activity-content">
                  <p className="activity-title">Auto-refresh enabled</p>
                  <p className="activity-time">Every 30 seconds</p>
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