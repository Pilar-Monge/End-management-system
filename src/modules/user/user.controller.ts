import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const repository = new UserRepository();
const service = new UserService(repository);

export class UserController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await service.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await service.findAllUsers();
      res.json(users);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }
      
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }
      
      const user = await service.findUserById(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(user);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }

      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }

      const user = await service.updateUser(id, req.body);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(user);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }

      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        res.status(400).json({ error: 'ID no proporcionado' });
        return;
      }

      const deleted = await service.deleteUser(id);
      if (!deleted) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const user = await service.login(req.body);
      if (!user) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      res.json(user);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }
}