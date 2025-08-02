const IS_PRODUCTION = true;
const API_BASE_URL = 'http://localhost:3001';
const PROD_API_BASE_URL = 'http://13.49.66.157:3001';  // <-- fixed

export const BASE_URL = IS_PRODUCTION ? PROD_API_BASE_URL : API_BASE_URL;

const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

logger.info('Server started on port ' + PORT);

const rateLimit = require('express-rate-limit');

// Apply to all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

const cors = require('cors');

const allowedOrigins = [
  process.env.CORS_ORIGIN, // e.g., https://yourdomain.com
  'chrome-extension://<YOUR_EXTENSION_ID>'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.enable('trust proxy');

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

const { body, param, validationResult } = require('express-validator');

router.post('/api/capture',
  body('url').isURL(),
  body('content').isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ...existing code...
  }
);
