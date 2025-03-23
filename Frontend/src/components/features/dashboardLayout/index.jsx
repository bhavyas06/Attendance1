import React from 'react';
import Sidebar from '../sidebar';
import Navbar from '../navbar';
import './dashboardLayout.css';

const DashboardLayout = ({ children, username = "John Doe" }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar username={username} />
        <div className="content-area">
          {children}  {/* Renders different dashboards dynamically */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
