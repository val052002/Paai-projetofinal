import { validationResult } from 'express-validator';
import * as auditService from '../services/auditService.js';

export async function createAudit(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const audit = await auditService.createAudit({ companyId: req.company.id, title: req.body.title });
    res.status(201).json(audit);
  } catch (err) {
    next(err);
  }
}

export async function getAudits(req, res, next) {
  try {
    const audits = await auditService.getAudits(req.company.id);
    res.json(audits);
  } catch (err) {
    next(err);
  }
}

export async function getAuditById(req, res, next) {
  try {
    const audit = await auditService.getAuditById(req.params.id, req.company.id);
    res.json(audit);
  } catch (err) {
    next(err);
  }
}
