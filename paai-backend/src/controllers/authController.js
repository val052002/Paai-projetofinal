import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const company = await authService.register(req.body);
    res.status(201).json({ message: 'Company registered successfully', company });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function setupMfa(req, res, next) {
  try {
    const result = await authService.setupMfa(req.company.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyMfa(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const result = await authService.verifyMfa(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
