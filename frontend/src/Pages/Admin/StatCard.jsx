import React from 'react';

const StatCard = ({ title, value, icon: Icon, iconClass, trend }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {trend && <p className="stat-trend">↗ {trend}</p>}
      </div>
      <div className={`stat-icon ${iconClass}`}>
        <Icon />
      </div>
    </div>
  </div>
);

export default StatCard;