import React from 'react';

const ResetPassword = () => (
  <div className="admin-password-container">
    <div className="admin-password-card">
      <h2 className="admin-password-title">Reset Password</h2>
      <form className="admin-password-form">
        <div className="admin-password-row">
          <div className="admin-password-item">
            <label>Customer ID</label>
            <input type="text" className="admin-password-input" value="C1003" readOnly />
          </div>
          <div className="admin-password-item">
            <label>Current Password</label>
            <input type="password" className="admin-password-input" placeholder="Current Password" />
          </div>
          <div className="admin-password-item">
            <label>New Password</label>
            <input type="password" className="admin-password-input" placeholder="New Password" />
          </div>
          <div className="admin-password-item">
            <label>Confirm Password</label>
            <input type="password" className="admin-password-input" placeholder="Confirm Password" />
          </div>
        </div>
        <button type="submit" className="admin-enter-btn">Enter</button>
      </form>
    </div>
  </div>
);

export default ResetPassword;