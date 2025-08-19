const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { setupDatabase } = require('./setup');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://bplo-user-1.onrender.com',
  'https://bplo-user.onrender.com',
  'https://bplo-user-1-1.onrender.com',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Safely import routes with error handling
const loadRoute = (path) => {
  try {
    return require(path);
  } catch (err) {
    console.error(`❌ Failed to load route ${path}:`, err.message);
    return express.Router(); // Fallback to empty router to prevent crash
  }
};

app.use('/api/permits', loadRoute('./routes/permit'));
app.use('/api/renewals', loadRoute('./routes/renewal'));
app.use('/api/zoning', loadRoute('./routes/zoning'));
app.use('/api/solidwaste', loadRoute('./routes/solidwaste'));
app.use('/api/obo', loadRoute('./routes/obo'));
app.use('/api/cho', loadRoute('./routes/cho'));
app.use('/api/electrical', loadRoute('./routes/electrical'));
app.use('/api/auth', loadRoute('./routes/auth'));

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    console.log('🔧 Initializing database...');
    await setupDatabase();
    console.log('✅ Database initialization complete');
    app.listen(PORT, () => {
      console.log(`🚀 BPLO Backend Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.stack);
    process.exit(1);
  }
}

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason.stack || reason);
  process.exit(1);
});

startServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;