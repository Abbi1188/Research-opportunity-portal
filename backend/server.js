const path = require('path');
const express = require('express');
const pool = require('./src/config/db');
const opportunityRoutes = require('./src/routes/opportunityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Allow the frontend (opened from a file or another port) to call this API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// API
app.use('/api/opportunities', opportunityRoutes);

// The frontend is also available at http://localhost:5000
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Unknown API route -> 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Errors (e.g. invalid JSON body -> 400, anything else -> 500)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Could not connect to MySQL. Check your .env settings:', err.message);
  }
});
