import React from 'react';
import './Header.css';

const Header = ({ onRefresh }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>🤖 AI Summary Dashboard</h1>
          <p>View and summarize captured web content</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 