import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Menu, Search, CheckCircle, Clock, ClipboardList, Edit, Eye } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

// CSS Styles
const styles = `
  .home-container {
    min-height: 100vh;
    background-color: #f9fafb;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .header {
    background: linear-gradient(135deg, #166534, #14532d);
    color: white;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    padding: 2rem 1.5rem;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header-button {
    padding: 0.5rem;
    border-radius: 0.75rem;
    background-color: rgba(134, 239, 172, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-button:hover {
    background-color: rgba(134, 239, 172, 0.3);
    transform: translateY(-1px);
  }

  .header-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  .header-subtitle {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }

  .main-content {
    padding: 0 1.5rem;
    margin-top: -1.5rem;
    position: relative;
    z-index: 10;
  }

  .task-summary-card {
    background: white;
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .task-summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .task-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .task-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .task-box {
    text-align: center;
    padding: 1.5rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .task-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .task-box-completed {
    background-color: #dcfce7;
  }

  .task-box-pending {
    background-color: #fef3c7;
  }

  .task-icon {
    margin: 0 auto 0.5rem;
  }

  .task-count {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .task-label {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .behavior-chart-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease;
  }

  .behavior-chart-card:hover {
    transform: translateY(-1px);
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .chart-container {
    height: 16rem;
    width: 100%;
  }

  .no-data-text {
    color: #6b7280;
    padding: 1rem 0;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .sidebar-overlay.visible {
    opacity: 1;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 20rem;
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.visible {
    transform: translateX(0);
  }

  .sidebar-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, #166534, #14532d);
    color: white;
  }

  .sidebar-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .sidebar-nav {
    padding: 1rem;
  }

  .sidebar-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    margin-bottom: 0.25rem;
  }

  .sidebar-item:hover {
    background-color: #f3f4f6;
    transform: translateX(4px);
  }

  .sidebar-item:active {
    transform: translateX(2px);
  }

  .sidebar-item-text {
    color: #1f2937;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .sidebar-item-icon {
    color: #16a34a;
    flex-shrink: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-content {
      padding: 1.5rem 1rem;
    }

    .header-title {
      font-size: 1.5rem;
    }

    .header-subtitle {
      font-size: 1rem;
    }

    .main-content {
      padding: 0 1rem;
    }

    .task-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .sidebar {
      width: 16rem;
    }

    .chart-container {
      height: 12rem;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      padding: 1rem;
    }

    .task-summary-card {
      padding: 1rem;
    }

    .behavior-chart-card {
      padding: 1rem;
    }

    .sidebar {
      width: 14rem;
    }
  }

  /* Animation keyframes */
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  /* Custom scrollbar */
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const Home = ({ navigation = {} }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  const [behaviorSummary, setBehaviorSummary] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Sidebar menu items
  const sidebarItems = [
    { id: '1', title: 'View Assigned Tasks', icon: ClipboardList, route: 'AssignedTasks' },
    { id: '2', title: 'Input Daily Animal Behavior', icon: Edit, route: 'AddBehavior' },
    { id: '3', title: 'View Animal', icon: Eye, route: 'AnimalView' },
  ];

  useEffect(() => {
    const loadUserAndStats = async () => {
      try {
        // Simulate getting user data in web environment
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          console.warn('❌ No userData found in localStorage.');
          // Set default user for demo
          setUserName('Demo User');
          setUserId('demo-id');
          return;
        }

        const userData = JSON.parse(userDataString);
        console.log("📦 Raw userData from localStorage:", userData);
        console.log("🆔 userId from localStorage:", userData._id);

        setUserName(userData.name);
        setUserId(userData._id);

        // Fetch stats here after getting userId
        const [completedRes, pendingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/tasks/count/completed/${userData._id}`),
          fetch(`${API_BASE_URL}/tasks/count/pending/${userData._id}`)
        ]);

        const completedData = await completedRes.json();
        const pendingData = await pendingRes.json();

        console.log("✅ Completed count:", completedData.count);
        console.log("🕒 Pending count:", pendingData.count);

        setTaskStats({
          completed: completedData.count,
          pending: pendingData.count
        });
      } catch (error) {
        console.error('❌ Failed to load user or stats:', error.message);
        // Set demo data on error
        setTaskStats({ completed: 5, pending: 3 });
      }
    };

    loadUserAndStats();
  }, []);

  useEffect(() => {
    if (behaviorSummary.length === 0) {
      setChartLabels([]);
      setChartData([]);
      return;
    }

    const dailyCounts = {};

    behaviorSummary.forEach(entry => {
      const day = entry.date.slice(5); // MM-DD format

      if (!dailyCounts[day]) {
        dailyCounts[day] = {
          eatingNormal: 0,
          moodAggressive: 0,
          movementLimping: 0,
        };
      }

      // Add counts if exist, else 0
      dailyCounts[day].eatingNormal += entry.eating?.Normal || 0;
      dailyCounts[day].moodAggressive += entry.mood?.Aggressive || 0;
      dailyCounts[day].movementLimping += entry.movement?.Limping || 0;
    });

    const labels = Object.keys(dailyCounts).sort();
    const data = labels.map(day => ({
      date: day,
      eatingNormal: dailyCounts[day].eatingNormal,
      moodAggressive: dailyCounts[day].moodAggressive,
      movementLimping: dailyCounts[day].movementLimping,
    }));

    setChartLabels(labels);
    setChartData(data);
  }, [behaviorSummary]);

  useEffect(() => {
    const fetchBehaviorSummary = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/behavior/summary?range=7`);
        const result = await response.json();
        console.log("📊 Behavior Summary Fetched:", result);
        setBehaviorSummary(result.data);
      } catch (error) {
        console.error("❌ Failed to fetch behavior summary:", error.message);
        // Set demo data for chart
        setBehaviorSummary([
          {
            date: '2024-01-15',
            eating: { Normal: 5 },
            mood: { Aggressive: 2 },
            movement: { Limping: 1 }
          },
          {
            date: '2024-01-16',
            eating: { Normal: 7 },
            mood: { Aggressive: 1 },
            movement: { Limping: 0 }
          },
          {
            date: '2024-01-17',
            eating: { Normal: 6 },
            mood: { Aggressive: 3 },
            movement: { Limping: 2 }
          }
        ]);
      }
    };

    fetchBehaviorSummary();
  }, []);

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleNavigation = (route) => {
    console.log(`Navigate to: ${route}`);
    if (navigation.navigate) {
      navigation.navigate(route);
    }
    closeSidebar();
  };

  const handleSearch = () => {
    console.log('Navigate to Search');
    if (navigation.navigate) {
      navigation.navigate('Search');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-container">
        {/* Header Section */}
        <div className="header">
          <div className="header-content">
            <div className="header-top">
              <button onClick={openSidebar} className="header-button">
                <Menu size={28} color="#86efac" />
              </button>
              <button onClick={handleSearch} className="header-button">
                <Search size={28} color="#86efac" />
              </button>
            </div>
            <h1 className="header-title">
              Welcome back{userName ? `, ${userName}` : ''}!
            </h1>
            <p className="header-subtitle">
              Let's keep your animals happy and healthy today.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Task Summary */}
          <div className="task-summary-card">
            <h2 className="task-title">
              📋 Task Overview
            </h2>
            <div className="task-grid">
              <div className="task-box task-box-completed">
                <CheckCircle size={28} className="task-icon" color="#15803d" />
                <div className="task-count">
                  {taskStats.completed}
                </div>
                <div className="task-label">Completed</div>
              </div>
              <div className="task-box task-box-pending">
                <Clock size={28} className="task-icon" color="#b45309" />
                <div className="task-count">
                  {taskStats.pending ?? 0}
                </div>
                <div className="task-label">Pending</div>
              </div>
            </div>
          </div>

          {/* Behavior Chart Section */}
          <div className="behavior-chart-card">
            <h2 className="chart-title">
              📊 Animal Behavior Trends (7 days)
            </h2>
            {chartData.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="eatingNormal"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Eating: Normal"
                    />
                    <Line
                      type="monotone"
                      dataKey="moodAggressive"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Mood: Aggressive"
                    />
                    <Line
                      type="monotone"
                      dataKey="movementLimping"
                      stroke="#eab308"
                      strokeWidth={2}
                      name="Movement: Limping"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="no-data-text">No behavior data yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Overlay */}
        {sidebarVisible && (
          <div
            className={`sidebar-overlay ${sidebarVisible ? 'visible' : ''}`}
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Menu</h2>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.route)}
                className="sidebar-item"
              >
                <item.icon size={24} className="sidebar-item-icon" />
                <span className="sidebar-item-text">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Home;