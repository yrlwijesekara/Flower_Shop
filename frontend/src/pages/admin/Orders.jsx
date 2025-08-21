import React, { useState, useEffect } from 'react';
import './Adminpage.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});

  // Fetch orders from API
  const fetchOrders = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('authToken');
      if (!adminToken) {
        setError('Authentication required. Please login as admin.');
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(`http://localhost:8000/api/admin/orders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchTerm, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    setCurrentPage(1);
    fetchOrders(1, searchTerm, status);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, searchTerm, statusFilter);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'admin-paid';
      case 'pending': return 'admin-pending';
      case 'failed': return 'admin-failed';
      default: return 'admin-notpaid';
    }
  };

  // Get order status class
  const getOrderStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'admin-delivered';
      case 'shipped': return 'admin-shipped';
      case 'processing': return 'admin-processing';
      case 'confirmed': return 'admin-confirmed';
      case 'cancelled': return 'admin-cancelled';
      default: return 'admin-pending';
    }
  };

  return (
    <div className="admin-orders-section">
      <div className="admin-orders-header">
        <h2 className="admin-section-title">Orders Management</h2>
        <div className="admin-orders-stats">
          <div className="admin-stat-item">
            <span className="admin-stat-value">${summary.totalRevenue || 0}</span>
            <span className="admin-stat-label">Total Revenue</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.totalOrders || 0}</span>
            <span className="admin-stat-label">Total Orders</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">${summary.avgOrderValue || 0}</span>
            <span className="admin-stat-label">Avg Order Value</span>
          </div>
        </div>
      </div>

      <div className="admin-orders-controls">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by order number, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
        <select 
          className="admin-filter-dropdown"
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : error ? (
        <div className="admin-error">Error: {error}</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-no-data">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="admin-order-id">#{order.orderNumber}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div className="admin-customer-info">
                          <div className="admin-customer-name">
                            {order.userId?.name || order.shippingAddress.fullName}
                          </div>
                          <div className="admin-customer-email">
                            {order.userId?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>{order.shippingAddress.phone}</td>
                      <td>
                        <div className="admin-order-items">
                          {order.items.slice(0, 2).map((item, index) => (
                            <span key={index} className="admin-item">
                              {item.productSnapshot.name}
                              {index < Math.min(order.items.length, 2) - 1 && ', '}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="admin-more-items">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-order-status ${getOrderStatusClass(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-payment-status ${getStatusClass(order.paymentStatus)}`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="admin-order-total">${order.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <div className="admin-pagination-numbers">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`admin-page-number ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="admin-pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;