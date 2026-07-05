// ─── CRITICAL: Override DNS before anything else ──────────────────────────────
// Your local router DNS (192.168.100.1) cannot resolve MongoDB Atlas SRV records.
// Force Node.js to use Google Public DNS (8.8.8.8) which resolves them correctly.
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

// ── Import routes ─────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/authRoutes');
const resumeRoutes    = require('./routes/resumeRoutes');
const analysisRoutes  = require('./routes/analysisRoutes');
const roadmapRoutes   = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const reportRoutes    = require('./routes/reportRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const userRoutes      = require('./routes/userRoutes');
const errorHandler    = require('./middleware/errorMiddleware');

// ── Startup environment log ───────────────────────────────────────────────────
const maskedURI = (process.env.MONGODB_URI || 'NOT SET').replace(/:([^@]+)@/, ':***@');
console.log('──────────────────────────────────────────');
console.log('  CareerCoach AI — Server Starting');
console.log('──────────────────────────────────────────');
console.log('  NODE_ENV     :', process.env.NODE_ENV   || 'development');
console.log('  PORT         :', process.env.PORT       || '5000');
console.log('  MONGODB_URI  :', maskedURI);
console.log('  FRONTEND_URL :', process.env.FRONTEND_URL || '(none)');
console.log('  DNS Servers  :', dns.getServers().join(', '));
console.log('──────────────────────────────────────────');

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const DEV_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const ok =
      DEV_ORIGIN_RE.test(origin) ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);
    if (ok) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW)       || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message:  'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders:   false
});
app.use('/api/', limiter);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Ensure upload/report dirs exist ──────────────────────────────────────────
const fs = require('fs');
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
const reportsDir = process.env.REPORT_DIR || './reports';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/resume',    resumeRoutes);
app.use('/api/analysis',  analysisRoutes);
app.use('/api/roadmap',   roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/report',    reportRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/user',      userRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status:   state === 1 ? 'OK' : 'DEGRADED',
    mongodb:  stateMap[state] || 'unknown',
    database: mongoose.connection.name || 'unknown',
    host:     mongoose.connection.host || 'unknown',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime()
  });
});

// ─── /api/test-db — insert, read, delete a test document ─────────────────────
app.get('/api/test-db', async (req, res) => {
  const result = { steps: {} };
  let testId;

  // Use a lightweight inline schema so no model import is needed
  const TestModel = mongoose.models.__dbtest ||
    mongoose.model('__dbtest', new mongoose.Schema({
      ping:      String,
      createdAt: { type: Date, default: Date.now }
    }));

  // 1. Insert
  try {
    const doc  = await TestModel.create({ ping: 'pong' });
    testId     = doc._id;
    result.steps.insert = { ok: true, id: doc._id };
  } catch (e) {
    result.steps.insert = { ok: false, error: e.message };
    return res.status(500).json({ success: false, result });
  }

  // 2. Read back
  try {
    const found = await TestModel.findById(testId);
    result.steps.read = { ok: !!found, data: found };
  } catch (e) {
    result.steps.read = { ok: false, error: e.message };
  }

  // 3. Delete
  try {
    await TestModel.findByIdAndDelete(testId);
    result.steps.delete = { ok: true };
  } catch (e) {
    result.steps.delete = { ok: false, error: e.message };
  }

  // 4. Collection inventory
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const colNames     = collections.map(c => c.name);
    const counts       = {};
    for (const col of ['users', 'resumes', 'analyses', 'reports']) {
      if (colNames.includes(col)) {
        counts[col] = await mongoose.connection.db.collection(col).countDocuments();
      }
    }
    result.steps.collections = { names: colNames, counts };
  } catch (e) {
    result.steps.collections = { ok: false, error: e.message };
  }

  res.json({
    success: true,
    database: mongoose.connection.name,
    host:     mongoose.connection.host,
    state:    mongoose.connection.readyState,
    result
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'AI Career Coach API',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.connection.name || 'unknown'
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ─── MongoDB connection ───────────────────────────────────────────────────────
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  // Mongoose 7 does not need useNewUrlParser / useUnifiedTopology
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,  // fail fast if Atlas unreachable
    socketTimeoutMS:          45000,
    family:                   4       // force IPv4 — avoids some IPv6 DNS issues
  });

  const db = conn.connection;
  console.log('──────────────────────────────────────────');
  console.log('  MongoDB Atlas Connected');
  console.log('  Host    :', db.host);
  console.log('  Database:', db.name);
  console.log('  State   :', db.readyState === 1 ? 'connected' : db.readyState);
  console.log('──────────────────────────────────────────');

  // Log any future disconnects / errors
  db.on('disconnected', () => console.warn('[MongoDB] Disconnected'));
  db.on('error',        (err) => console.error('[MongoDB] Error:', err.message));
  db.on('reconnected',  () => console.log('[MongoDB] Reconnected'));
};

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Test DB: http://localhost:${PORT}/api/test-db`);
    });
  } catch (error) {
    console.error('──────────────────────────────────────────');
    console.error('  STARTUP FAILED');
    console.error('  Error  :', error.message);
    console.error('  Code   :', error.code   || 'n/a');
    console.error('  Stack  :', error.stack);
    console.error('──────────────────────────────────────────');

    // Friendly diagnosis
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('DIAGNOSIS: DNS cannot resolve MongoDB Atlas SRV record.');
      console.error('  Your local DNS does not support SRV lookups for mongodb+srv://');
      console.error('  FIX: dns.setServers([\'8.8.8.8\']) is already applied in this file.');
      console.error('  If still failing, check your OS-level DNS or firewall.');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('DIAGNOSIS: Wrong username or password in MONGODB_URI.');
      console.error('  Check .env — the username and password must match Atlas Database Access settings.');
    } else if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('DIAGNOSIS: Your IP is not whitelisted in Atlas Network Access.');
      console.error('  Go to Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0) for dev.');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('DIAGNOSIS: SSL/TLS error. Try adding ?ssl=true&tlsAllowInvalidCertificates=true to URI.');
    }

    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('[UnhandledRejection]', err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;
