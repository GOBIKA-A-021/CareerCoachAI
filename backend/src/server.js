require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const errorHandler = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// ─── Security middleware ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Accept any localhost / 127.0.0.1 origin in development so the frontend works
// regardless of which port Vite picks (3000, 5173, 5174, 5175, …).
// In production set FRONTEND_URL to the real domain, e.g. https://myapp.com
const DEV_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin: (origin, callback) => {
    // No origin = server-to-server call (Vite proxy, curl, Postman) — always allow
    if (!origin) return callback(null, true);

    const isLocalhost = DEV_ORIGIN_RE.test(origin);
    const isProductionFrontend =
      process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;

    if (isLocalhost || isProductionFrontend) {
      return callback(null, true);
    }

    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200   // some legacy browsers choke on 204
};

// Handle pre-flight OPTIONS for all routes BEFORE any other middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Upload / report directories ──────────────────────────────────────────────
const fs = require('fs');
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
const reportsDir = process.env.REPORT_DIR || './reports';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'AI Career Coach API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      resume: '/api/resume',
      analysis: '/api/analysis',
      roadmap: '/api/roadmap',
      interview: '/api/interview',
      report: '/api/report',
      admin: '/api/admin',
      user: '/api/user'
    }
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ─── Database + server start ──────────────────────────────────────────────────
const connectDB = async () => {
  const conn = await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/careercoach'
  );
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`CORS: accepting all localhost origins + ${process.env.FRONTEND_URL || '(no FRONTEND_URL set)'}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

module.exports = app;

