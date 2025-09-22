import express from 'express';
import {
  criarProblema,
  listarProblemas,
  obterProblema,
  listarProblemasDoProfesor,
  atualizarProblema,
  deletarProblema
} from '../controllers/problemaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas (para alunos)
router.get('/', listarProblemas);
router.get('/:id', obterProblema);

// Rotas protegidas (para professores)
router.post('/', protect, criarProblema);
router.get('/professor/meus', protect, listarProblemasDoProfesor);
router.put('/:id', protect, atualizarProblema);
router.delete('/:id', protect, deletarProblema);

export default router;

