import React from 'react';
import './CaptureItem.css';

const CaptureItem = ({ capture, onSummarize, onDelete, summaryLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No content available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="capture-item">
      <div className="capture-header">
        <div className="capture-title">
          <h3>{capture.title || 'Untitled'}</h3>
          <span className="capture-domain">{getDomainFromUrl(capture.url)}</span>
        </div>
        <div className="capture-meta">
          <span className="word-count">{capture.wordCount || 0} words</span>
          <span className="timestamp">{formatDate(capture.timestamp)}</span>
        </div>
      </div>

      <div className="capture-url">
        <a href={capture.url} target="_blank" rel="noopener noreferrer">
          {capture.url}
        </a>
      </div>

      <div className="capture-content">
        <p>{truncateText(capture.content)}</p>
      </div>

      <div className="capture-actions">
        <button
          className="btn btn-primary"
          onClick={() => onSummarize(capture.id)}
          disabled={summaryLoading}
        >
          {summaryLoading ? '🤖 Generating...' : '🤖 Summarize'}
        </button>
        
        <button
          className="btn btn-danger"
          onClick={() => onDelete(capture.id)}
          disabled={summaryLoading}
        >
          🗑️ Delete
        </button>
      </div>

      {capture.summary && (
        <div className="capture-summary-indicator">
          <span className="summary-badge">✅ Summarized</span>
          <small>Click "Summarize" to view or regenerate</small>
        </div>
      )}
    </div>
  );
};

export default CaptureItem; 