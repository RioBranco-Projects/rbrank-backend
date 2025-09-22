// routes/submissionRoutes.ts
import express from "express";
import {
  createSubmission,
  listSubmissions,
  updateSubmission,
} from "../controllers/submissionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// aluno envia código
router.post("/", createSubmission);
// professor lista envios de um desafio
router.get("/:challengeId", protect, listSubmissions);
// professor aprova/reprova um envio
router.patch("/:id", protect, updateSubmission);

export default router;
