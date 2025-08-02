import React from 'react';
import './SummaryModal.css';

const SummaryModal = ({ summary, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🤖 AI Summary</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Source Information */}
          <div className="source-info">
            <h3>{summary.title || 'Untitled'}</h3>
            <p className="source-url">
              <a href={summary.url} target="_blank" rel="noopener noreferrer">
                {summary.url}
              </a>
            </p>
            <p className="source-domain">{getDomainFromUrl(summary.url)}</p>
          </div>

          {/* Summary Content */}
          <div className="summary-content">
            <div className="summary-section">
              <h4>📝 Summary</h4>
              <p>{summary.summary?.summary || 'No summary available'}</p>
            </div>

            <div className="summary-section">
              <h4>🔍 Key Insights</h4>
              <ul>
                {summary.summary?.keyInsights?.map((insight, index) => (
                  <li key={index}>{insight}</li>
                )) || ['No insights available']}
              </ul>
            </div>

            <div className="summary-section">
              <h4>💡 Actionable Suggestions</h4>
              <ul>
                {summary.summary?.actionableSuggestions?.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                )) || ['No suggestions available']}
              </ul>
            </div>

            {/* Metadata */}
            <div className="summary-metadata">
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-label">Content Type:</span>
                  <span className="metadata-value">{summary.summary?.contentType || 'Unknown'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Reading Time:</span>
                  <span className="metadata-value">{summary.summary?.estimatedReadingTime || 'Unknown'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Word Count:</span>
                  <span className="metadata-value">{summary.summary?.wordCount || 0} words</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Generated:</span>
                  <span className="metadata-value">{formatDate(summary.summaryGeneratedAt)}</span>
                </div>
              </div>
            </div>

            {/* Cache Status */}
            {summary.cached && (
              <div className="cache-notice">
                <span>🔄 Using cached summary (generated within the last hour)</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal; 