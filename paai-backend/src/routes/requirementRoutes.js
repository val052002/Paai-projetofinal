import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import pool from '../config/db.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, codigo, titulo, dominio, recomendacao
       FROM controlos_iso ORDER BY codigo`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
