import React from 'react';
import CaptureItem from './CaptureItem';
import './CaptureList.css';

const CaptureList = ({ captures, onSummarize, onDelete, summaryLoading }) => {
  if (captures.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h3>No captures yet</h3>
        <p>Use the Chrome extension to capture page content</p>
        <div className="empty-tips">
          <h4>How to get started:</h4>
          <ol>
            <li>Install the Chrome extension</li>
            <li>Navigate to any webpage</li>
            <li>Click the extension icon and "Capture Page"</li>
            <li>Come back here to view and summarize your captures</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="capture-list">
      <div className="list-header">
        <h2>📋 Captured Pages ({captures.length})</h2>
      </div>
      
      <div className="captures-grid">
        {captures.map((capture) => (
          <CaptureItem
            key={capture.id}
            capture={capture}
            onSummarize={onSummarize}
            onDelete={onDelete}
            summaryLoading={summaryLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default CaptureList; 