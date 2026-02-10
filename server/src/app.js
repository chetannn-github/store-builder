import express from "express";
import helmet from "helmet";
import cors from 'cors';
import morgan from 'morgan';
import "dotenv/config";

import './config/kubernetes.js';
import storeRoutes from './routes/store.routes.js'; 
import authRoutes from './routes/auth.routes.js';
import { NODE_ENV } from "./config/env.js";
import { trusted } from "mongoose";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: ["http://store-builder.chickenkiller.com:3000/", 
      "http://localhost:3000","http://51.21.19.170:3000",
      "http://store-builder.chickenkiller.com:3000/"
      
    ],
    credentials : true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'Store Platform API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});


app.use('/api/stores', storeRoutes); 
app.use('/api/auth/', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : undefined
  });
});



export default app;