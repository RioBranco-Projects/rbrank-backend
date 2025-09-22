// controllers/submissionController.ts
import Submission from "../models/Submission.js";
import Problema from "../models/Problema.js"; // ✅ o certo
import Aluno from "../models/Aluno.js";

// aluno envia código (com token ou RA)
export const createSubmission = async (req, res) => {
  try {
    const { challengeId, code, ra } = req.body;
    if (!challengeId || !code) {
      return res
        .status(400)
        .json({ error: "challengeId e code são obrigatórios" });
    }

    const problema = await Problema.findById(challengeId);
    if (!problema)
      return res.status(404).json({ error: "Problema não encontrado" });

    // tenta pegar ID do aluno do token; se não houver, usa RA
    let studentId = req.user?.id || req.aluno?.id || null;
    if (!studentId) {
      if (!ra) return res.status(400).json({ error: "Informe o RA do aluno" });
      const aluno = await Aluno.findOne({ ra });
      if (!aluno)
        return res.status(404).json({ error: "Aluno não encontrado pelo RA" });
      studentId = aluno._id;
    }

    const submission = await Submission.create({
      challengeId,
      studentId,
      code,
    });
    res.status(201).json({ message: "Submissão criada", submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// aluno lista submissões
export const listSubmissions = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const submissions = await Submission.find({ challengeId })
      .sort({ createdAt: -1 })
      .populate("studentId", "nomeCompleto ra")
      .populate("challengeId", "titulo nivel");
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// aluno atualiza submissão
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    // Atualiza submissão
    const submission = await Submission.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true },
    )
      .populate("studentId", "nomeCompleto ra pontuacao problemasResolvidos")
      .populate("challengeId", "titulo nivel pontos");

    if (!submission) {
      return res.status(404).json({ error: "Submissão não encontrada" });
    }

    // Se foi aprovado → soma pontos e registra problema
    if (status === "approved") {
      const aluno = await Aluno.findById(submission.studentId._id);
      const problema = await Problema.findById(submission.challengeId._id);

      if (aluno && problema) {
        // Evita contar pontos duplicados se o aluno já resolveu esse problema
        const jaResolvido = aluno.problemasResolvidos.some(
          (p) => p.problema.toString() === problema._id.toString(),
        );

        if (!jaResolvido) {
          aluno.pontuacao = (aluno.pontuacao || 0) + (problema.pontos || 0);
          aluno.problemasResolvidos.push({
            problema: problema._id,
            dataResolucao: new Date(),
          });
          await aluno.save();
        }
      }
    }

    res.json({ message: "Submissão atualizada", submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
