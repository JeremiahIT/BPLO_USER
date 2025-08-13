const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { setupDatabase } = require('./setup');

// Routes
const permitRoutes = require('./routes/permit');
const renewalRoutes = require('./routes/renewal');
const zoningRoutes = require('./routes/zoning');
const solidwasteRoutes = require('./routes/solidwaste');
const oboRoutes = require('./routes/obo');
const choRoutes = require('./routes/cho');
const electricalRoutes = require('./routes/electrical');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1); // for Render

// Security
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ✅ FIX: Explicitly allow both frontend and backend domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://bplo-user-1.onrender.com',
  'https://bplo-user.onrender.com'
];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/permits', permitRoutes);
app.use('/api/renewals', renewalRoutes);
app.use('/api/zoning', zoningRoutes);
app.use('/api/solidwaste', solidwasteRoutes);
app.use('/api/obo', oboRoutes);
app.use('/api/cho', choRoutes);
app.use('/api/electrical', electricalRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
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
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

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
