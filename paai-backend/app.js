import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/authRoutes.js';
import auditRoutes from './src/routes/auditRoutes.js';
import requirementRoutes from './src/routes/requirementRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/audits', auditRoutes);
app.use('/requirements', requirementRoutes);

app.use(errorHandler);

export default app;
