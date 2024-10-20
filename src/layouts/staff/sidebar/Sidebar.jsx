import React from 'react';
import './Sidebar.scss';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sec-sidebar">
      <div className="init css-5is5xo">
        <div className="simplebar-wrapper">
        <ul>
        <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </li>
        <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          Orders
        </li>
        <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
          Bookings
        </li>
        <li className={activeTab === 'shipments' ? 'active' : ''} onClick={() => setActiveTab('shipments')}>
          Shipments
        </li>
      </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
