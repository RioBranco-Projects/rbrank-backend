import express from 'express';
import {
  cadastrarAluno,
  buscarAlunoPorRA,
  resolverProblema,
  obterRanking
} from '../controllers/alunoController.js';

const router = express.Router();

router.post('/cadastrar', cadastrarAluno);
router.get('/buscar/:ra', buscarAlunoPorRA);
router.post('/resolver-problema', resolverProblema);
router.get('/ranking', obterRanking);

export default router;

