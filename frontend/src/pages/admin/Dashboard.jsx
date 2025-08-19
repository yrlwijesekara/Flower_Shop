import React from 'react';

const Dashboard = () => (
  <>
    <header className="admin-header">
      <h1 className="admin-header-title"> Admin Dashboard</h1>
      <span className="admin-header-welcome">Welcome, Admin!</span>
    </header>
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="admin-stat-title">Total Sales</div>
        <div className="admin-stat-value">$12,345</div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-title">New Orders</div>
        <div className="admin-stat-value">89</div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-title">Total Products</div>
        <div className="admin-stat-value">150</div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-title">Active Users</div>
        <div className="admin-stat-value">250</div>
      </div>
    </div>
  </>
);

export default Dashboard;