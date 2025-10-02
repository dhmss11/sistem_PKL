import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { setResponseHeader } from './middleware/set-headers.js';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dudiRoutes from './routes/dudiRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();


dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
 credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use("/api/dudi", dudiRoutes);
app.use("/api/school", schoolRoutes);

app.get('/', [setResponseHeader], (req, res) => {
  return res.status(200).json({
    message: `Welcome to the server!`,
    timestamp: new Date().toLocaleString('id-ID'),
    status: 'running'
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err.message.includes('CORS') || err.message.includes('token')) {
    return res.status(400).json({ 
      message: 'Request error', 
      error: 'Invalid headers or CORS issue' 
    });
  }
  
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;