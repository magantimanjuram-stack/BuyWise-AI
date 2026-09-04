import cors from 'cors';
import express, { Request, Response } from 'express';

import { CONFIG } from './config/index.js';
import { analyzeRouter } from './routes/analyze.js';
import { paymentRouter } from './routes/payment.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/buywise', analyzeRouter);
app.use('/api/payment', paymentRouter);

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system: 'BuyWise AI Commerce Decision Agent',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler Middleware
app.use((err: any, _req: Request, res: Response, _next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON request payload format' });
  }
  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(CONFIG.PORT, () => {
  const maskedKey = CONFIG.RAZORPAY_KEY_ID ? `${CONFIG.RAZORPAY_KEY_ID.substring(0, 12)}...` : 'Not Configured';
  console.log(`====================================================`);
  console.log(` BuyWise AI Server running on http://localhost:${CONFIG.PORT}`);
  console.log(` Environment: ${CONFIG.NODE_ENV}`);
  console.log(` Razorpay Key ID: ${maskedKey}`);
  console.log(`====================================================`);
});

export default app;
