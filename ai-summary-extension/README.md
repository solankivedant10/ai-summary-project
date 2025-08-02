# AI Summary Chrome Extension

A Chrome extension that captures web page content and sends it to a backend API for AI-powered summarization and analysis.

## 🚀 Features

- **Page Content Capture**: Extracts text content from any web page
- **Modern UI**: Beautiful, responsive popup interface
- **API Integration**: Sends captured content to backend server
- **Dashboard**: Web interface to view and manage captured content
- **Manifest V3**: Built with the latest Chrome extension standards
- **CORS Support**: Properly configured for local development

## 📁 Project Structure

```
ai-summary-extension/
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json          # Extension manifest (Manifest V3)
│   ├── popup.html            # Extension popup interface
│   ├── popup.js              # Popup functionality
│   └── background.js         # Background service worker
├── backend/                   # Node.js API server
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server file
│   ├── routes/
│   │   └── capture.js        # API routes for content capture
│   └── models/
│       └── Capture.js        # MongoDB schema (optional)
├── frontend/                  # React dashboard
│   ├── src/                  # React source code
│   ├── public/               # Public assets
│   ├── package.json          # Frontend dependencies
│   └── index.html            # Simple HTML dashboard (alternative)
├── prompts/                   # AI prompt templates
│   └── prompts.md            # Example prompts for AI services
├── env.example               # Environment variables template
└── README.md                 # This file
```

## 🛠️ Setup Instructions

### 1. Backend Setup

1. **Install MongoDB** (if not already installed):
   - **Windows**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: `sudo apt install mongodb` (Ubuntu/Debian)

2. **Start MongoDB**:
   ```bash
   # Windows: Start MongoDB service
   # macOS/Linux:
   sudo systemctl start mongod
   # or
   mongod
   ```

3. Navigate to the backend directory:
   ```bash
   cd ai-summary-extension/backend
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create environment file:
   ```bash
   cp ../env.example .env
   ```

6. Start the server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

The backend will be running at `http://localhost:3001` and connected to MongoDB at `mongodb://localhost:27017/ai-summary`

### 2. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked" and select the `chrome-extension` folder

4. The extension should now appear in your extensions list

5. Click the extension icon in your toolbar to test

### 3. React Frontend Dashboard

1. **Navigate to the frontend directory:**
   ```bash
   cd ai-summary-extension/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The React app will open at `http://localhost:3000`

**Alternative: Simple HTML Dashboard**
If you prefer the simple HTML version:
```bash
cd frontend
python -m http.server 8000
# or
npx serve .
```
Then open `http://localhost:8000` in your browser.

### 4. Testing Gemini Integration

1. **Test the API endpoints**:
   ```bash
   cd backend
   node test-api.js
   ```

2. **Test Gemini API specifically**:
   ```bash
   cd backend
   node test-gemini.js
   ```

3. **Manual testing**:
   - Capture a webpage using the extension
   - Use the API: `GET http://localhost:3001/api/summarize/:capture-id`

## 🎯 Usage

### Using the Chrome Extension

1. Navigate to any web page you want to capture
2. Click the extension icon in your Chrome toolbar
3. Click the "Capture Page" button
4. The extension will extract the page content and send it to your API
5. Check the dashboard to view captured content

### API Endpoints

- `GET /health` - Health check
- `POST /api/capture` - Capture page content
- `GET /api/captures` - Get all captures (reverse chronological order)
- `GET /api/capture/:id` - Get specific capture
- `DELETE /api/capture/:id` - Delete specific capture
- `GET /api/summarize/:id` - Generate AI summary for a capture
- `POST /api/summarize` - Generate summary for custom content

### Example API Request

```javascript
// Capture page content
const response = await fetch('http://localhost:3001/api/capture', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        url: 'https://example.com',
        title: 'Example Page',
        content: 'Page content here...',
        timestamp: new Date().toISOString()
    })
});
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-summary
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key-here
```

### Chrome Extension Permissions

The extension requires these permissions:
- `activeTab` - To access the current tab
- `scripting` - To execute content scripts
- `http://localhost:3001/*` - To communicate with the API

## 🎨 Customization

### Styling the Extension

Edit `chrome-extension/popup.html` to customize the popup appearance.

### AI Integration with Google Gemini

The project now includes Google Gemini API integration for automatic content summarization:

#### Setup:
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add your API key to the `.env` file: `GEMINI_API_KEY=your-key-here`
3. Restart the server

#### Features:
- **Automatic Summarization**: Generate AI summaries for captured content
- **Structured Output**: Get key insights and actionable suggestions
- **Caching**: Summaries are cached for 1 hour to reduce API calls
- **Error Handling**: Graceful fallback when API is unavailable

#### Usage:
```bash
# Generate summary for a captured page
GET /api/summarize/:id

# Generate summary for custom content
POST /api/summarize
{
  "content": "Your content here",
  "url": "https://example.com",
  "title": "Page Title"
}
```

#### Summary Response Format:
```json
{
  "summary": "Concise summary of the content",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "actionableSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "contentType": "article",
  "estimatedReadingTime": "5 minutes",
  "wordCount": 1500
}
```

### Database Integration

The project now uses MongoDB with Mongoose for persistent storage. The MongoDB schema is defined in `backend/models/Capture.js` with the following fields:

- `url` (required) - The webpage URL
- `title` - Page title (defaults to "Untitled")
- `content` (required) - Captured page content
- `wordCount` - Number of words in the content
- `contentLength` - Length of the content in characters
- `timestamp` - When the capture was made
- `createdAt` - Document creation timestamp (auto-generated)
- `updatedAt` - Document update timestamp (auto-generated)

The database automatically sorts captures in reverse chronological order (newest first).

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running and CORS is properly configured
2. **Extension Not Loading**: Check that all files are in the correct location
3. **API Connection Failed**: Verify the backend is running on port 3001
4. **Content Not Captured**: Some pages may block content extraction

### Debug Mode

Enable Chrome DevTools for the extension:
1. Go to `chrome://extensions/`
2. Find your extension
3. Click "Details"
4. Click "Inspect views: popup"

## 🔒 Security Considerations

- The extension only captures text content, not images or scripts
- API requests are limited to localhost for development
- Content is truncated to prevent oversized requests
- Consider adding authentication for production use

## 🚀 Production Deployment

For production deployment:

1. **Backend**: Deploy to a cloud service (Heroku, AWS, etc.)
2. **Database**: Use a managed MongoDB service
3. **Security**: Add proper authentication and HTTPS
4. **CORS**: Update CORS settings for your domain
5. **Extension**: Publish to Chrome Web Store

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub. 