import React, { useState, useEffect } from 'react';
import './Adminpage.css';

const Comments = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, averageRating: 0 });
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      let url = `http://localhost:8000/api/reviews/admin/all?page=${page}&limit=10`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
        setStats(data.data.stats);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (reviewId, isApproved) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:8000/api/reviews/admin/${reviewId}/approval`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reviews list
        fetchReviews(currentPage, filter === 'all' ? '' : filter);
        alert(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
      } else {
        alert(data.message || 'Failed to update review');
      }
    } catch (err) {
      console.error('Update approval error:', err);
      alert('Failed to update review approval');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:8000/api/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reviews list
        fetchReviews(currentPage, filter === 'all' ? '' : filter);
        alert('Review deleted successfully');
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      alert('Failed to delete review');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    fetchReviews(1, newFilter === 'all' ? '' : newFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReviews(page, filter === 'all' ? '' : filter);
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`admin-review-star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading && reviews.length === 0) {
    return (
      <div className="admin-feedback-container">
        <div className="admin-feedback-card">
          <div className="admin-review-loading-message">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-feedback-container">
      <div className="admin-feedback-card">
        <div className="admin-review-management-header">
          <h2 className="admin-feedback-title">Review Management</h2>
          
          {/* Statistics */}
          <div className="admin-review-stats-grid">
            <div className="admin-review-stat-card">
              <span className="admin-review-stat-number">{stats.total}</span>
              <span className="admin-review-stat-label">Total Reviews</span>
            </div>
            <div className="admin-review-stat-card">
              <span className="admin-review-stat-number">{stats.approved}</span>
              <span className="admin-review-stat-label">Approved</span>
            </div>
            <div className="admin-review-stat-card">
              <span className="admin-review-stat-number">{stats.pending}</span>
              <span className="admin-review-stat-label">Pending</span>
            </div>
            <div className="admin-review-stat-card">
              <span className="admin-review-stat-number">{stats.averageRating}</span>
              <span className="admin-review-stat-label">Avg Rating</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="admin-review-filter-tabs">
          <button 
            className={`admin-review-filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Reviews
          </button>
          <button 
            className={`admin-review-filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => handleFilterChange('approved')}
          >
            Approved
          </button>
          <button 
            className={`admin-review-filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending Approval
          </button>
        </div>

        {error && (
          <div className="admin-review-error-message">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="admin-reviews-container">
          {reviews.length === 0 ? (
            <div className="admin-review-no-results">
              No reviews found for the selected filter.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={`admin-review-card ${review.isApproved ? 'approved' : 'pending'}`}>
                <div className="admin-review-card-header">
                  <div className="admin-review-user-details">
                    <strong>{review.userName}</strong>
                    <span className="admin-review-user-email">({review.userEmail})</span>
                    <span className="admin-review-created-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="admin-review-product-info">
                    <span className="admin-review-product-name">{review.productName}</span>
                  </div>
                </div>
                
                <div className="admin-review-content-section">
                  <div className="admin-review-rating-display">
                    {renderStars(review.rating)}
                    <span className="admin-review-rating-text">({review.rating}/5)</span>
                  </div>
                  <h4 className="admin-review-title-text">{review.title}</h4>
                  <p className="admin-review-comment-text">
                    {review.comment.length > 150 
                      ? `${review.comment.substring(0, 150)}...` 
                      : review.comment
                    }
                  </p>
                  
                  {review.comment.length > 150 && (
                    <button 
                      className="admin-review-read-more"
                      onClick={() => openReviewModal(review)}
                    >
                      Read More
                    </button>
                  )}
                </div>
                
                <div className="admin-review-actions-section">
                  <div className="admin-review-status-info">
                    <span className={`admin-review-status-badge ${review.isApproved ? 'approved' : 'pending'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className="admin-review-helpful-count">👍 {review.helpful} helpful</span>
                  </div>
                  
                  <div className="admin-review-action-buttons">
                    {!review.isApproved && (
                      <button 
                        className="admin-review-approve-btn"
                        onClick={() => handleApprovalChange(review.id, true)}
                      >
                        Approve
                      </button>
                    )}
                    {review.isApproved && (
                      <button 
                        className="admin-review-reject-btn"
                        onClick={() => handleApprovalChange(review.id, false)}
                      >
                        Reject
                      </button>
                    )}
                    <button 
                      className="admin-review-delete-btn"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-review-pagination">
            <button 
              className="admin-review-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="admin-review-pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              className="admin-review-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="admin-review-modal-overlay" onClick={closeReviewModal}>
          <div className="admin-review-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-review-modal-header">
              <h3>Review Details</h3>
              <button className="admin-review-modal-close" onClick={closeReviewModal}>×</button>
            </div>
            
            <div className="admin-review-modal-body">
              <div className="admin-review-modal-info">
                <p><strong>Customer:</strong> {selectedReview.userName}</p>
                <p><strong>Email:</strong> {selectedReview.userEmail}</p>
                <p><strong>Product:</strong> {selectedReview.productName}</p>
                <p><strong>Date:</strong> {formatDate(selectedReview.createdAt)}</p>
                <div className="admin-review-modal-rating">
                  <strong>Rating: </strong>
                  {renderStars(selectedReview.rating)}
                  <span>({selectedReview.rating}/5)</span>
                </div>
              </div>
              
              <div className="admin-review-modal-content-section">
                <h4>{selectedReview.title}</h4>
                <p>{selectedReview.comment}</p>
              </div>
              
              <div className="admin-review-modal-actions">
                {!selectedReview.isApproved && (
                  <button 
                    className="admin-review-approve-btn"
                    onClick={() => {
                      handleApprovalChange(selectedReview.id, true);
                      closeReviewModal();
                    }}
                  >
                    Approve Review
                  </button>
                )}
                {selectedReview.isApproved && (
                  <button 
                    className="admin-review-reject-btn"
                    onClick={() => {
                      handleApprovalChange(selectedReview.id, false);
                      closeReviewModal();
                    }}
                  >
                    Reject Review
                  </button>
                )}
                <button 
                  className="admin-review-delete-btn"
                  onClick={() => {
                    handleDeleteReview(selectedReview.id);
                    closeReviewModal();
                  }}
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;