import React, { useState, useEffect } from 'react';
import './Adminpage.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch contacts from API
  const fetchContacts = async (page = 1, search = '', status = '', priority = '') => {
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
        ...(status && { status }),
        ...(priority && { priority })
      });

      const response = await fetch(`http://localhost:8000/api/contact/admin?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setContacts(data.data.contacts);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContacts(1, searchTerm, statusFilter, priorityFilter);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    setCurrentPage(1);
    fetchContacts(1, searchTerm, status, priorityFilter);
  };

  // Handle priority filter change
  const handlePriorityFilter = (e) => {
    const priority = e.target.value;
    setPriorityFilter(priority);
    setCurrentPage(1);
    fetchContacts(1, searchTerm, statusFilter, priority);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchContacts(page, searchTerm, statusFilter, priorityFilter);
  };

  // Update contact status
  const updateContactStatus = async (contactId, newStatus, priority = null, adminNotes = '') => {
    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/contact/admin/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          ...(priority && { priority }),
          ...(adminNotes && { adminNotes })
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchContacts(currentPage, searchTerm, statusFilter, priorityFilter);
        setShowModal(false);
        setSelectedContact(null);
      } else {
        setError(data.message || 'Failed to update contact');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Network error. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'new': return 'admin-status-new';
      case 'read': return 'admin-status-read';
      case 'replied': return 'admin-status-replied';
      case 'resolved': return 'admin-status-resolved';
      default: return 'admin-status-new';
    }
  };

  // Get priority class
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'admin-priority-high';
      case 'medium': return 'admin-priority-medium';
      case 'low': return 'admin-priority-low';
      default: return 'admin-priority-medium';
    }
  };

  // Handle contact view
  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    // Mark as read if it's new
    if (contact.status === 'new') {
      await updateContactStatus(contact._id, 'read');
    }
  };

  return (
    <div className="admin-contacts-section">
      <div className="admin-contacts-header">
        <h2 className="admin-section-title">Contact Management</h2>
        <div className="admin-contacts-stats">
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.total || 0}</span>
            <span className="admin-stat-label">Total Messages</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.new || 0}</span>
            <span className="admin-stat-label">New</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.replied || 0}</span>
            <span className="admin-stat-label">Replied</span>
          </div>
          <div className="admin-stat-item">
            <span className="admin-stat-value">{summary.resolved || 0}</span>
            <span className="admin-stat-label">Resolved</span>
          </div>
        </div>
      </div>

      <div className="admin-contacts-controls">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
        
        <div className="admin-filters">
          <select 
            className="admin-filter-dropdown"
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select 
            className="admin-filter-dropdown"
            value={priorityFilter}
            onChange={handlePriorityFilter}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading contacts...</div>
      ) : error ? (
        <div className="admin-error">Error: {error}</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-contacts-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-no-data">No contacts found</td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{formatDate(contact.createdAt)}</td>
                      <td className="admin-contact-name">{contact.name}</td>
                      <td>{contact.email}</td>
                      <td className="admin-contact-subject">{contact.subject}</td>
                      <td>
                        <span className={`admin-contact-status ${getStatusClass(contact.status)}`}>
                          {contact.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-contact-priority ${getPriorityClass(contact.priority)}`}>
                          {contact.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="admin-btn-view"
                          onClick={() => handleViewContact(contact)}
                        >
                          View
                        </button>
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

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Contact Details</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="admin-modal-body">
              <div className="admin-contact-details">
                <div className="admin-detail-row">
                  <strong>Name:</strong> {selectedContact.name}
                </div>
                <div className="admin-detail-row">
                  <strong>Email:</strong> {selectedContact.email}
                </div>
                <div className="admin-detail-row">
                  <strong>Phone:</strong> {selectedContact.phone || 'N/A'}
                </div>
                <div className="admin-detail-row">
                  <strong>Subject:</strong> {selectedContact.subject}
                </div>
                <div className="admin-detail-row">
                  <strong>Date:</strong> {formatDate(selectedContact.createdAt)}
                </div>
                <div className="admin-detail-row">
                  <strong>Status:</strong> 
                  <span className={`admin-contact-status ${getStatusClass(selectedContact.status)}`}>
                    {selectedContact.status.toUpperCase()}
                  </span>
                </div>
                <div className="admin-detail-row">
                  <strong>Priority:</strong> 
                  <span className={`admin-contact-priority ${getPriorityClass(selectedContact.priority)}`}>
                    {selectedContact.priority.toUpperCase()}
                  </span>
                </div>
                <div className="admin-detail-row">
                  <strong>Message:</strong>
                  <div className="admin-message-content">{selectedContact.message}</div>
                </div>
                {selectedContact.adminNotes && (
                  <div className="admin-detail-row">
                    <strong>Admin Notes:</strong>
                    <div className="admin-notes-content">{selectedContact.adminNotes}</div>
                  </div>
                )}
              </div>
              
              <div className="admin-contact-actions">
                <div className="admin-action-buttons">
                  <button 
                    className="admin-btn-status admin-btn-replied"
                    onClick={() => updateContactStatus(selectedContact._id, 'replied')}
                  >
                    Mark as Replied
                  </button>
                  <button 
                    className="admin-btn-status admin-btn-resolved"
                    onClick={() => updateContactStatus(selectedContact._id, 'resolved')}
                  >
                    Mark as Resolved
                  </button>
                </div>
                
                <div className="admin-priority-actions">
                  <label>Set Priority:</label>
                  <select 
                    onChange={(e) => updateContactStatus(selectedContact._id, selectedContact.status, e.target.value)}
                    value={selectedContact.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;