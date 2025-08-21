import React, { useState } from 'react';
import { reviewAPI } from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!formData.title.trim()) {
      setError('Please provide a review title');
      return;
    }
    
    if (!formData.comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    if (formData.title.length > 100) {
      setError('Review title must be less than 100 characters');
      return;
    }

    if (formData.comment.length > 1000) {
      setError('Review comment must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage (assuming user is logged in)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Please log in to submit a review');
      }

      const reviewData = {
        productId,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim()
      };

      await reviewAPI.createReview(reviewData, token);
      
      setSuccess('Review submitted successfully!');
      
      // Reset form
      setFormData({
        rating: 5,
        title: '',
        comment: ''
      });

      // Call callback to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Auto-close after success
      setTimeout(() => {
        onCancel();
      }, 2000);

    } catch (error) {
      console.error('Submit review error:', error);
      setError(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`review-star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => handleRatingClick(index + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h3>Write a Review</h3>
          <button 
            type="button" 
            className="close-button"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating Section */}
          <div className="form-group">
            <label className="form-label">Rating *</label>
            <div className="rating-input">
              {renderStars(formData.rating, true)}
              <span className="rating-text">
                {formData.rating === 1 ? 'Poor' : 
                 formData.rating === 2 ? 'Fair' : 
                 formData.rating === 3 ? 'Good' : 
                 formData.rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            </div>
          </div>

          {/* Title Section */}
          <div className="form-group">
            <label className="form-label">Review Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your review..."
              maxLength={100}
              className="form-input"
              disabled={isSubmitting}
            />
            <div className="character-count">
              {formData.title.length}/100 characters
            </div>
          </div>

          {/* Comment Section */}
          <div className="form-group">
            <label className="form-label">Review Comment *</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Share your thoughts about this product..."
              maxLength={1000}
              rows={6}
              className="form-textarea"
              disabled={isSubmitting}
            />
            <div className="character-count">
              {formData.comment.length}/1000 characters
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting || !formData.title.trim() || !formData.comment.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;