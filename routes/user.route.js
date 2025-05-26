import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteAllUsers,
  deleteUser,
  searchUser,
} from '../controllers/user.controller.js';
const userRoutes = Router();

userRoutes.get('/', authMiddleware, getAllUsers);
userRoutes.get('/:id', authMiddleware, getUserById);
userRoutes.post('/search', authMiddleware, searchUser);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.delete('/', authMiddleware, deleteAllUsers);
userRoutes.delete('/:id', authMiddleware, deleteUser);

export default userRoutes;
