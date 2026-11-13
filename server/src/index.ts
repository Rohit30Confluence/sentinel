import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { apiRouter } from './routes/api.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Sentinel AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRouter);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Sentinel Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Sentinel Server Error'
  });
});

// Start listening if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🛡️ Sentinel AI Backend running on http://localhost:${PORT}`);
    console.log(`📡 Ready for SSE Chat Streaming and Multi-Provider Requests`);
  });
}

export default app;
