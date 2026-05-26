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
