import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { traceMiddleware } from './middleware/trace.js';
import * as dispatchService from './services/dispatchService.js';
import { logger } from './utils/logger.js';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', exposedHeaders: ['X-Correlation-ID'] }));
app.use(express.json());
app.use(traceMiddleware); // Injects Correlation ID

// Dashboard Logic
app.get('/api/dashboard/today', async (req, res) => {
  try {
    const data = await dispatchService.getDashboardData();
    res.json(data);
  } catch (e) {
    logger.error("Dashboard fetch failed", e);
    res.status(500).json({ error: e.message });
  }
});

// Load Balancer / Auto-Dispatch
app.post('/api/deliveries/auto-dispatch', async (req, res) => {
  const result = await dispatchService.runLoadBalancer(req.body.deliveryId);
  res.json(result);
});

app.listen(3001, () => logger.info("VaultWares Backend Active on Port 3001"));