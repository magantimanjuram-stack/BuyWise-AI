import { Request, Response, Router } from 'express';

import { runBuyWiseOrchestration } from '../engine/orchestrator.js';
import { UserAnalysisRequest } from '../types/index.js';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', (req: Request, res: Response) => {
  try {
    const body = req.body as UserAnalysisRequest;

    if (!body || !body.category) {
      return res.status(400).json({ error: 'Missing required field: category' });
    }

    if (typeof body.budget !== 'number' || body.budget <= 0) {
      return res.status(400).json({ error: 'Budget must be a positive number' });
    }

    const result = runBuyWiseOrchestration({
      category: body.category,
      budget: body.budget,
      purpose: Array.isArray(body.purpose) ? body.purpose : [],
      requirementText: body.requirementText || ''
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error running BuyWise orchestration:', error);
    return res.status(400).json({ error: error.message || 'Failed to perform analysis' });
  }
});
