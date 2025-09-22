import Aluno from "../models/Aluno.js";
import Problema from "../models/Problema.js";

export const cadastrarAluno = async (req, res) => {
  try {
    const { nomeCompleto, ra, semestre } = req.body;

    const alunoExistente = await Aluno.findOne({ ra });
    if (alunoExistente) {
      return res.status(400).json({ message: "RA já cadastrado" });
    }

    const aluno = new Aluno({
      nomeCompleto,
      ra,
      semestre,
    });

    await aluno.save();
    res.status(201).json({ message: "Aluno cadastrado com sucesso", aluno });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

export const buscarAlunoPorRA = async (req, res) => {
  try {
    const { ra } = req.params;
    const aluno = await Aluno.findOne({ ra }).populate(
      "problemasResolvidos.problema",
    );

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Resolver problema
export const resolverProblema = async (req, res) => {
  try {
    const { ra, problemaId, solucao } = req.body;

    const aluno = await Aluno.findOne({ ra });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const problema = await Problema.findById(problemaId);
    if (!problema) {
      return res.status(404).json({ message: "Problema não encontrado" });
    }

    // Verificar se o aluno já resolveu este problema
    const jaResolvido = aluno.problemasResolvidos.some(
      (p) => p.problema.toString() === problemaId,
    );

    if (jaResolvido) {
      return res
        .status(400)
        .json({ message: "Problema já resolvido por este aluno" });
    }

    // Verificar se a solução está correta (comparação simples)
    if (
      solucao.trim().toLowerCase() ===
      problema.solucaoEsperada.trim().toLowerCase()
    ) {
      // Adicionar problema resolvido
      aluno.problemasResolvidos.push({
        problema: problemaId,
        dataResolucao: new Date(),
      });

      // Adicionar pontos
      aluno.pontuacao += problema.pontos;
      await aluno.save();

      res.json({
        message: "Problema resolvido com sucesso!",
        pontosGanhos: problema.pontos,
        pontuacaoTotal: aluno.pontuacao,
      });
    } else {
      res.status(400).json({ message: "Solução incorreta" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Obter ranking de alunos
export const obterRanking = async (req, res) => {
  try {
    const ranking = await Aluno.find()
      .sort({ pontuacao: -1 })
      .select("nomeCompleto ra semestre pontuacao")
      .limit(50);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};
