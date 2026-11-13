import { Request, Response } from 'express';
import { AVAILABLE_MODELS, DEFAULT_PERSONAS } from '../constants/personas.js';

export function getAvailableModels(req: Request, res: Response): void {
  // Check which keys are configured on the server environment
  const modelsWithStatus = AVAILABLE_MODELS.map((m) => {
    let serverConfigured = false;
    if (m.provider === 'mock') serverConfigured = true;
    if (m.provider === 'gemini') serverConfigured = !!process.env.GEMINI_API_KEY;
    if (m.provider === 'openai') serverConfigured = !!process.env.OPENAI_API_KEY;
    if (m.provider === 'anthropic') serverConfigured = !!process.env.ANTHROPIC_API_KEY;

    return {
      ...m,
      serverConfigured
    };
  });

  res.json(modelsWithStatus);
}

export function getPersonas(req: Request, res: Response): void {
  res.json(DEFAULT_PERSONAS);
}
