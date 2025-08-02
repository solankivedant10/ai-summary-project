# AI Summary Dashboard - React Frontend

A modern React dashboard for viewing and summarizing captured web content using Google Gemini AI.

## 🚀 Features

- **📋 Capture List**: View all captured web pages in a beautiful grid layout
- **🤖 AI Summarization**: Generate intelligent summaries using Google Gemini API
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **⚡ Real-time Updates**: Refresh data and see changes instantly
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations
- **📊 Rich Metadata**: View content type, reading time, and word counts

## 🛠️ Setup

### Prerequisites

- Node.js (v14 or higher)
- Backend server running on `http://localhost:3001`
- Google Gemini API key configured in backend

### Installation

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
   The app will open at `http://localhost:3000`

## 🎯 Usage

### Viewing Captures

1. The dashboard automatically loads all captured pages
2. Each capture shows:
   - Page title and domain
   - URL with clickable link
   - Content preview (truncated)
   - Word count and timestamp
   - Action buttons

### Generating Summaries

1. Click the **"🤖 Summarize"** button on any capture
2. The system will call the Gemini API to generate a summary
3. A modal will open showing:
   - **Summary**: Concise overview of the content
   - **Key Insights**: 3 main takeaways
   - **Actionable Suggestions**: 3 practical recommendations
   - **Metadata**: Content type, reading time, generation timestamp

### Managing Captures

- **Refresh**: Click the refresh button to reload all captures
- **Delete**: Remove unwanted captures with the delete button
- **View Original**: Click the URL to open the original page

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # Dashboard header
│   │   ├── CaptureList.js  # List of captures
│   │   ├── CaptureItem.js  # Individual capture card
│   │   └── SummaryModal.js # AI summary modal
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Configuration

### API Endpoints

The frontend automatically connects to the backend API:

- `GET /api/captures` - Fetch all captures
- `GET /api/summarize/:id` - Generate summary for a capture
- `DELETE /api/capture/:id` - Delete a capture

### Proxy Configuration

The app is configured to proxy API requests to `http://localhost:3001` (see `package.json`).

## 🎨 Customization

### Styling

- **Colors**: Modify CSS variables in component files
- **Layout**: Adjust grid layouts in `CaptureList.css`
- **Animations**: Customize transitions and keyframes

### Components

- **Header**: Modify title, description, and buttons
- **CaptureItem**: Customize card layout and information display
- **SummaryModal**: Adjust summary presentation format

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop**: Grid layout with multiple columns
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout with optimized touch targets

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to load captures"**
   - Ensure backend server is running on port 3001
   - Check MongoDB connection

2. **"Failed to generate summary"**
   - Verify Gemini API key is configured in backend
   - Check internet connection

3. **CORS errors**
   - Backend CORS is configured for `http://localhost:3000`
   - Ensure you're accessing the frontend on the correct port

### Development

- **Hot Reload**: Changes automatically refresh in development
- **Console Logs**: Check browser console for detailed error messages
- **Network Tab**: Monitor API requests in browser dev tools

## 🚀 Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## 📝 License

MIT License - feel free to use and modify for your projects. 