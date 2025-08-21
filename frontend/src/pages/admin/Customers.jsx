import React, { useState, useEffect } from 'react';
import './Adminpage.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});

  // Fetch customers from API
  const fetchCustomers = async (page = 1, search = '', verified = '') => {
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
        ...(verified && { verified })
      });

      const response = await fetch(`http://localhost:8000/api/admin/customers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(data.data.customers);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers(1, searchTerm, verifiedFilter);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setVerifiedFilter(filter);
    setCurrentPage(1);
    fetchCustomers(1, searchTerm, filter);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCustomers(page, searchTerm, verifiedFilter);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update customer status
  const updateCustomerStatus = async (customerId, isVerified) => {
    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/customers/${customerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the customers list
        fetchCustomers(currentPage, searchTerm, verifiedFilter);
      } else {
        setError(data.message || 'Failed to update customer status');
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="admin-customers-section">
      <div className="admin-customers-header">
        <h2 className="admin-section-title">Customer Management</h2>
        <div className="admin-customers-stats">
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.totalCustomers || 0}</span>
            <span className="admin-stat-label">Total Customers</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.verifiedCustomers || 0}</span>
            <span className="admin-stat-label">Verified</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.unverifiedCustomers || 0}</span>
            <span className="admin-stat-label">Unverified</span>
          </div>
        </div>
      </div>

      <div className="admin-customers-controls">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
        <select 
          className="admin-filter-dropdown"
          value={verifiedFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Customers</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading customers...</div>
      ) : error ? (
        <div className="admin-error">Error: {error}</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-customers-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-no-data">No customers found</td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="admin-customer-id">#{customer._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <div className="admin-customer-info">
                          <div className="admin-customer-name">{customer.name}</div>
                        </div>
                      </td>
                      <td className="admin-customer-email">{customer.email}</td>
                      <td>{customer.phone || 'N/A'}</td>
                      <td>
                        <div className="admin-customer-address">
                          {customer.address ? (
                            <>
                              {customer.address.street && <div>{customer.address.street}</div>}
                              <div>
                                {[customer.address.city, customer.address.state, customer.address.zipCode]
                                  .filter(Boolean)
                                  .join(', ')}
                              </div>
                              {customer.address.country && <div>{customer.address.country}</div>}
                            </>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-verification-status ${customer.isVerified ? 'admin-verified' : 'admin-unverified'}`}>
                          {customer.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </td>
                      <td>{formatDate(customer.createdAt)}</td>
                      <td>
                        <div className="admin-action-btn-group">
                          <button
                            className={`admin-status-btn ${customer.isVerified ? 'admin-unverify-btn' : 'admin-verify-btn'}`}
                            onClick={() => updateCustomerStatus(customer._id, !customer.isVerified)}
                            title={customer.isVerified ? 'Unverify Customer' : 'Verify Customer'}
                          >
                            {customer.isVerified ? 'Unverify' : 'Verify'}
                          </button>
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
    </div>
  );
};

export default Customers;