require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');


const captureRoutes = require('./routes/capture');

const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-summary';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Security & Logging Middleware
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'));
} else {
    app.use(morgan('dev'));
}
const rateLimit = require('express-rate-limit');

// Apply general rate limiting to all /api routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ✅ UPDATED CORS CONFIGURATION
const allowedOrigins = [
    'http://localhost:3000',
    'https://13.49.66.157', // Your AWS EC2 IP
    'chrome-extension://majedbggpeeiokphgeagopcbohcpdnck' // Your Chrome Extension ID
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow curl/postman

        if (
            origin.startsWith('chrome-extension://') ||
            origin.startsWith('http://localhost') ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', captureRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'AI Summary Backend'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'AI Summary Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            capture: '/api/capture',
            captures: '/api/captures',
            summarize: '/api/summarize/:id'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Start server
// Start server
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`📝 Capture API: http://localhost:${PORT}/api/capture`);
        console.log(`📋 Captures API: http://localhost:${PORT}/api/captures`);
        console.log(`🤖 Summarize API: http://localhost:${PORT}/api/summarize/:id`);
        console.log(`🗄️  MongoDB: ${MONGODB_URI}`);
        console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
    } else {
        console.info(`✅ Server started on port ${PORT}`);
    }
});

module.exports = app;
