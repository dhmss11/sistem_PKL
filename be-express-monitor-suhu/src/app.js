import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { setResponseHeader } from './middleware/set-headers.js';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import masterProdukRouters from './routes/masterProdukRoutes.js';
import masterGudang from './routes/masterGudang.js';
import stockRoutes from './routes/stockRoutes.js';
import satuanStockRoutes from './routes/satuanStockRoutes.js';
import rakRoutes from './routes/rakRoutes.js';
import kartuStockRoutes from './routes/kartuStockRoutes.js';
import golonganstock from './routes/golonganstock.js';
import kirimBarang from './routes/kirimBarangRoutes.js';
import terimaBarang from './routes/terimaBarangRoutes.js';

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
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/master-produk', masterProdukRouters);
app.use('/api/nama-gudang', masterGudang);
app.use('/api/stock', stockRoutes);
app.use('/api/rak', rakRoutes);
app.use('/api/satuan', satuanStockRoutes);
app.use('/api/kartustock', kartuStockRoutes);
app.use('/api/golonganstock', golonganstock);
app.use('/api/kirimbarang', kirimBarang);
app.use('/api/terimabarang', terimaBarang);

// Default route
app.get('/', [setResponseHeader], (req, res) => {
  return res.status(200).json({
    message: `Welcome to the server!`,
    timestamp: new Date().toLocaleString('id-ID'),
    status: 'running'
  });
});

// Error handling middleware
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