import express from 'express';
import {
  loginProfessor,
  cadastrarProfessor
} from '../controllers/professorController.js';

const router = express.Router();

router.post('/login', loginProfessor);
router.post('/cadastrar', cadastrarProfessor);

export default router;

