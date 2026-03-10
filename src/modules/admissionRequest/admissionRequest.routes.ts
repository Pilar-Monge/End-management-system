import { Router } from 'express';
import { Pool } from 'pg';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';
import { AdmissionRequestController } from './admissionRequest.controller';

export const createAdmissionRequestRouter = (pool: Pool): Router => {
  const router = Router();
  
  const repository = new AdmissionRequestRepository(pool);
  const service = new AdmissionRequestService(repository);
  const controller = new AdmissionRequestController(service);

  router.post('/', controller.createRequest);
  router.get('/:id', controller.getRequestById);
  router.get('/', controller.getAllRequests);
  router.put('/:id', controller.updateRequest);
  router.delete('/:id', controller.deleteRequest);
  
  router.post('/:id/process-ai', controller.processWithAI);
  router.post('/:id/review', controller.reviewByAdmin);
  router.get('/camps/:campsId/pending', controller.getPendingByCamp);

  return router;
};