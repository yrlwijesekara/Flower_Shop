import React, { useState, useEffect } from 'react';
import './Adminpage.css';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8000/api/analytics/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      shipped: '#00bcd4',
      delivered: '#4caf50',
      cancelled: '#f44336',
      returned: '#795548'
    };
    return colors[status] || '#666';
  };

  const renderChart = () => {
    if (!analytics?.chartData?.monthlyRevenue) return null;

    const maxRevenue = Math.max(...analytics.chartData.monthlyRevenue.map(item => item.revenue));
    const chartHeight = 200;

    return (
      <div className="admin-dashboard-chart">
        <h3 className="admin-dashboard-chart-title">Monthly Revenue (Last 12 Months)</h3>
        <div className="admin-dashboard-chart-container">
          <div className="admin-dashboard-chart-bars">
            {analytics.chartData.monthlyRevenue.map((item, index) => {
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * chartHeight : 0;
              return (
                <div key={index} className="admin-dashboard-chart-bar-container">
                  <div 
                    className="admin-dashboard-chart-bar"
                    style={{ height: `${height}px` }}
                    title={`${item.month} ${item.year}: ${formatCurrency(item.revenue)}`}
                  ></div>
                  <span className="admin-dashboard-chart-label">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <>
        <header className="admin-header">
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <span className="admin-header-welcome">Welcome, Admin!</span>
        </header>
        <div className="admin-dashboard-loading">Loading analytics...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="admin-header">
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <span className="admin-header-welcome">Welcome, Admin!</span>
        </header>
        <div className="admin-dashboard-error">{error}</div>
      </>
    );
  }

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Admin Dashboard</h1>
        <span className="admin-header-welcome">Welcome, Admin!</span>
      </header>
      
      {/* Overview Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-card-orders">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-content">
            <div className="admin-stat-title">Total Orders</div>
            <div className="admin-stat-value">{analytics?.overview?.totalOrders || 0}</div>
            <div className="admin-stat-subtitle">+{analytics?.overview?.todayOrders || 0} today</div>
          </div>
        </div>
        
        <div className="admin-stat-card admin-stat-card-products">
          <div className="admin-stat-icon">🌸</div>
          <div className="admin-stat-content">
            <div className="admin-stat-title">Total Products</div>
            <div className="admin-stat-value">{analytics?.overview?.totalProducts || 0}</div>
            <div className="admin-stat-subtitle">In catalog</div>
          </div>
        </div>
        
        <div className="admin-stat-card admin-stat-card-customers">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-content">
            <div className="admin-stat-title">Customers</div>
            <div className="admin-stat-value">{analytics?.overview?.totalCustomers || 0}</div>
            <div className="admin-stat-subtitle">Registered users</div>
          </div>
        </div>
        
        <div className="admin-stat-card admin-stat-card-revenue">
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-content">
            <div className="admin-stat-title">Total Revenue</div>
            <div className="admin-stat-value">{formatCurrency(analytics?.sales?.totalRevenue)}</div>
            <div className="admin-stat-subtitle">All time</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="admin-secondary-stats">
        <div className="admin-secondary-stat-card">
          <h3>This Month</h3>
          <div className="admin-secondary-stat-item">
            <span>Orders:</span>
            <strong>{analytics?.overview?.monthlyOrders || 0}</strong>
          </div>
          <div className="admin-secondary-stat-item">
            <span>Revenue:</span>
            <strong>{formatCurrency(analytics?.sales?.monthlyRevenue)}</strong>
          </div>
        </div>
        
        <div className="admin-secondary-stat-card">
          <h3>Today</h3>
          <div className="admin-secondary-stat-item">
            <span>Orders:</span>
            <strong>{analytics?.overview?.todayOrders || 0}</strong>
          </div>
          <div className="admin-secondary-stat-item">
            <span>Revenue:</span>
            <strong>{formatCurrency(analytics?.sales?.todayRevenue)}</strong>
          </div>
        </div>
        
        <div className="admin-secondary-stat-card">
          <h3>Average</h3>
          <div className="admin-secondary-stat-item">
            <span>Order Value:</span>
            <strong>{formatCurrency(analytics?.sales?.averageOrderValue)}</strong>
          </div>
          <div className="admin-secondary-stat-item">
            <span>Reviews:</span>
            <strong>{analytics?.overview?.totalReviews || 0}</strong>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {renderChart()}

      {/* Recent Orders and Order Status */}
      <div className="admin-dashboard-bottom-section">
        <div className="admin-recent-orders">
          <h3>Recent Orders</h3>
          <div className="admin-recent-orders-list">
            {analytics?.recentOrders?.slice(0, 6).map((order) => (
              <div key={order.id} className="admin-recent-order-item">
                <div className="admin-recent-order-info">
                  <strong>#{order.orderNumber}</strong>
                  <span>{order.customerName}</span>
                </div>
                <div className="admin-recent-order-details">
                  <span className="admin-recent-order-amount">{formatCurrency(order.amount)}</span>
                  <span 
                    className="admin-recent-order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="admin-recent-order-date">
                  {formatDate(order.date)}
                </div>
              </div>
            )) || []}
          </div>
        </div>

        <div className="admin-order-status-stats">
          <h3>Order Status Distribution</h3>
          <div className="admin-status-stats-list">
            {Object.entries(analytics?.orderStatus || {}).map(([status, count]) => (
              <div key={status} className="admin-status-stat-item">
                <div className="admin-status-stat-info">
                  <span 
                    className="admin-status-stat-dot"
                    style={{ backgroundColor: getStatusColor(status) }}
                  ></span>
                  <span className="admin-status-stat-label">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <span className="admin-status-stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;