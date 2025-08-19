import React from 'react';
import './Adminpage.css';

const Customers = () => (
  <div className="admin-customers-container">
    <div className="admin-customers-card">
      <div className="admin-customers-header">
        <h2 className="admin-customers-title">Customers</h2>
        <div className="admin-customers-controls">
          <input type="text" className="admin-search-input" placeholder="Search..." />
          <button className="admin-filter-btn">All Customers</button>
        </div>
      </div>
      <div className="admin-table-container">
        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Contact No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>C1001</td>
              <td>Atheef Solam</td>
              <td>atheefsolam@gmail.com</td>
              <td>+94 729983819</td>
              <td>
                <div className="admin-action-btn-group">
                  <button className="admin-edit-btn">Edit</button>
                  <button className="admin-delete-btn">Delete</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>C1002</td>
              <td>Mohamed Mukarram</td>
              <td>mukarram23@gmail.com</td>
              <td>+94 766934585</td>
              <td>
                <div className="admin-action-btn-group">
                  <button className="admin-edit-btn">Edit</button>
                  <button className="admin-delete-btn">Delete</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>C1003</td>
              <td>Hansara Hettiyarchchi</td>
              <td>hansara56@gmail.com</td>
              <td>+94 766934612</td>
              <td>
                <div className="admin-action-btn-group">
                  <button className="admin-edit-btn">Edit</button>
                  <button className="admin-delete-btn">Delete</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>C1004</td>
              <td>Nipun Nivindya</td>
              <td>nipun78@gmail.com</td>
              <td>+94 756934585</td>
              <td>
                <div className="admin-action-btn-group">
                  <button className="admin-edit-btn">Edit</button>
                  <button className="admin-delete-btn">Delete</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>C1005</td>
              <td>Dulanka Nimsara</td>
              <td>dulanka45@gmail.com</td>
              <td>+94 719634528</td>
              <td>
                <div className="admin-action-btn-group">
                  <button className="admin-edit-btn">Edit</button>
                  <button className="admin-delete-btn">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="admin-pagination">
        <button className="admin-pagination-btn">Previous</button>
        <div className="admin-pagination-numbers">
          <span className="admin-page-number">|[ 1 | 2 | 3 | 4 ]|</span>
        </div>
        <button className="admin-pagination-btn">Next</button>
      </div>
    </div>
  </div>
);

export default Customers;