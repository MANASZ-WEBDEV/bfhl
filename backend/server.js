require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// --------------- Routes ---------------
app.get('/', (_req, res) => {
  res.json({
    service: 'DeskFlow API',
    version: '1.0.0',
    status: 'running',
    docs: {
      endpoints: [
        'POST   /tickets',
        'GET    /tickets',
        'PATCH  /tickets/:id',
        'DELETE /tickets/:id',
        'GET    /tickets/stats',
      ],
    },
  });
});

app.use('/tickets', ticketRoutes);

// --------------- BFHL Endpoints ---------------
app.get('/bfhl', (_req, res) => {
  res.json({
    operation_code: 1
  });
});

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: 'Invalid input. "data" array is required.' });
    }

    const numbers = [];
    const alphabets = [];

    data.forEach(item => {
      const val = String(item).trim();
      if (/^\d+$/.test(val)) {
        numbers.push(val);
      } else if (/^[a-zA-Z]$/.test(val)) {
        alphabets.push(val);
      }
    });

    let highest_alphabet = [];
    if (alphabets.length > 0) {
      // Sort alphabetically case-insensitively to find the highest letter
      const sorted = [...alphabets].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
      highest_alphabet = [sorted[sorted.length - 1]];
    }

    res.json({
      is_success: true,
      user_id: "manas_rajani_26052026",
      email: "manasrajanidy89@gmail.com",
      roll_number: "AITR2026",
      numbers,
      alphabets,
      highest_alphabet
    });
  } catch (err) {
    res.status(500).json({ is_success: false, error: 'Internal server error' });
  }
});

// Catch-all for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// --------------- Start ---------------
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 DeskFlow API listening on port ${PORT}`);
  });
});
