import React from 'react';

const Comments = () => (
  <div className="admin-feedback-container">
    <div className="admin-feedback-card">
      <h2 className="admin-feedback-title">Feedback</h2>
      <div className="admin-feedback-form">
        <div className="admin-feedback-row">
          <div className="admin-feedback-item">
            <label>Customer ID</label>
            <input type="text" className="admin-feedback-input" value="C1003" readOnly />
          </div>
          <div className="admin-feedback-item">
            <label>Feedback</label>
            <textarea className="admin-feedback-textarea" placeholder="Worem ipsum dolor sit amet, consectetur adipiscing elit..."></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Comments;