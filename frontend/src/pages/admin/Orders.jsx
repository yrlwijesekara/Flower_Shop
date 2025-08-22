import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEye, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiDollarSign, FiPackage } from 'react-icons/fi';
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          note: `Status updated by admin via quick edit`
        })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh orders list
        fetchOrders(currentPage, searchTerm, statusFilter);
      } else {
        setError(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Network error. Please try again.');
    }
  };

  // View order details
  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Delete order
  const deleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchOrders(currentPage, searchTerm, statusFilter);
        // If we're on a page with no orders after deletion, go to previous page
        if (orders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
          fetchOrders(currentPage - 1, searchTerm, statusFilter);
        }
      } else {
        setError(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Network error. Please try again.');
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="admin-no-data">No orders found</td>
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
                      <td>
                        <div className="admin-order-actions">
                          <select 
                            className="admin-status-dropdown"
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                          </select>
                          <div className="admin-order-action-buttons">
                            <button 
                              className="admin-btn-view"
                              onClick={() => handleViewOrder(order)}
                              title="View order details"
                            >
                              <FiEye size={14} />
                            </button>
                            <button 
                              className="admin-btn-delete"
                              onClick={() => deleteOrder(order._id, order.orderNumber)}
                              title="Delete order"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
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

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content admin-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Order Details - #{selectedOrder.orderNumber}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="admin-modal-body">
              {/* Customer Information */}
              <div className="admin-order-section">
                <h4><FiUser size={16} /> Customer Information</h4>
                <div className="admin-order-details">
                  <div className="admin-detail-row">
                    <FiUser size={14} />
                    <strong>Name:</strong> {selectedOrder.userId?.name || selectedOrder.shippingAddress.fullName}
                  </div>
                  <div className="admin-detail-row">
                    <FiMail size={14} />
                    <strong>Email:</strong> {selectedOrder.userId?.email || 'N/A'}
                  </div>
                  <div className="admin-detail-row">
                    <FiPhone size={14} />
                    <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="admin-order-section">
                <h4><FiPackage size={16} /> Order Information</h4>
                <div className="admin-order-details">
                  <div className="admin-detail-row">
                    <FiCalendar size={14} />
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </div>
                  <div className="admin-detail-row">
                    <span className={`admin-order-status ${getOrderStatusClass(selectedOrder.orderStatus)}`}>
                      Status: {selectedOrder.orderStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="admin-detail-row">
                    <span className={`admin-payment-status ${getStatusClass(selectedOrder.paymentStatus)}`}>
                      Payment: {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="admin-detail-row">
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="admin-order-section">
                <h4><FiMapPin size={16} /> Shipping Address</h4>
                <div className="admin-order-details">
                  <div className="admin-address-content">
                    {selectedOrder.shippingAddress.fullName}<br />
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="admin-order-section">
                <h4><FiPackage size={16} /> Order Items</h4>
                <div className="admin-order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="admin-order-item">
                      <div className="admin-item-info">
                        <strong>{item.productSnapshot.name}</strong>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="admin-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="admin-order-section">
                <h4><FiDollarSign size={16} /> Order Summary</h4>
                <div className="admin-order-summary">
                  <div className="admin-summary-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="admin-summary-row">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className="admin-summary-row">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="admin-summary-row">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="admin-summary-row admin-summary-total">
                    <strong>Total: ${selectedOrder.totalAmount?.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-order-modal-actions">
                <button 
                  className="admin-btn-status admin-btn-delete-modal"
                  onClick={() => {
                    deleteOrder(selectedOrder._id, selectedOrder.orderNumber);
                    setShowModal(false);
                  }}
                >
                  <FiTrash2 size={16} />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;