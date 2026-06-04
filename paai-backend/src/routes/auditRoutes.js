import { Router } from 'express';
import { body } from 'express-validator';
import authenticate from '../middleware/authenticate.js';
import * as auditController from '../controllers/auditController.js';

const router = Router();

router.use(authenticate);

router.post('/',
  body('title').trim().notEmpty().withMessage('Audit title is required'),
  auditController.createAudit
);

router.get('/', auditController.getAudits);

router.get('/:id', auditController.getAuditById);

router.post('/:id/responses',
  body('responses').isArray({ min: 1 }).withMessage('Responses must be a non-empty array'),
  auditController.saveResponses
);

router.post('/:id/finalize', auditController.finalizeAudit);

router.get('/:id/report', auditController.getReport);
router.get('/:id/report/pdf', auditController.getReportPdf);

export default router;
