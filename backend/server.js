const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { setupDatabase } = require('./setup');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend URLs
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors()); // ✅ Preflight

app.set('trust proxy', 1);
app.use(helmet());

// ✅ Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, try again later.',
});
app.use('/api/', limiter);

// ✅ Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// ✅ Routes
const loadRoute = (path) => {
  try {
    return require(path);
  } catch (err) {
    console.error(`❌ Failed to load route ${path}:`, err.message);
    return express.Router();
  }
};

app.use('/api/auth', loadRoute('./routes/auth'));
app.use('/api/permits', loadRoute('./routes/permit'));
app.use('/api/renewals', loadRoute('./routes/renewal'));
app.use('/api/zoning', loadRoute('./routes/zoning'));
app.use('/api/solidwaste', loadRoute('./routes/solidwaste'));
app.use('/api/obo', loadRoute('./routes/obo'));
app.use('/api/cho', loadRoute('./routes/cho'));
app.use('/api/electrical', loadRoute('./routes/electrical'));

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start server
async function startServer() {
  try {
    console.log('🔧 Initializing database...');
    await setupDatabase();
    console.log('✅ Database initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
