import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.post('/users', (req, res) => controller.create(req, res));
router.get('/users', (req, res) => controller.findAll(req, res));
router.get('/users/:id', (req, res) => controller.findById(req, res));
router.put('/users/:id', (req, res) => controller.update(req, res));
router.delete('/users/:id', (req, res) => controller.delete(req, res));
router.post('/auth/login', (req, res) => controller.login(req, res));

export default router;