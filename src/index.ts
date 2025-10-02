import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import apiRoutes from './routes/api';
import healthRoutes from './routes/health';
import screensRoutes from './routes/screens';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'User Screens 4 Isaac - Server is running!',
    project: 'User interface screens for Isaac',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      screens: '/api/screens'
    }
  });
});

// API Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/api/screens', screensRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 User Screens 4 Isaac server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoints: http://localhost:${PORT}/api`);
  console.log(`📱 User screens: http://localhost:${PORT}/api/screens`);
  console.log(`📁 Static files: http://localhost:${PORT}/`);
});

export default app;
