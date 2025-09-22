import Problema from "../models/Problema.js";

// Criar novo problema
export const criarProblema = async (req, res) => {
  try {
    const { titulo, descricao, nivel } = req.body;
    const professorId = req.professor.id;

    const problema = new Problema({
      titulo,
      descricao,
      nivel,
      professor: professorId,
    });

    await problema.save();
    res.status(201).json({ message: "Problema criado com sucesso", problema });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Listar todos os problemas ativos
export const listarProblemas = async (req, res) => {
  try {
    const problemas = await Problema.find({ ativo: true })
      .select("titulo descricao nivel pontos createdAt")
      .populate("professor", "nome")
      .sort({ createdAt: -1 });

    res.json(problemas);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Obter problema por ID
export const obterProblema = async (req, res) => {
  try {
    const { id } = req.params;
    const problema = await Problema.findById(id)
      .select("titulo descricao nivel pontos createdAt")
      .populate("professor", "nome");

    if (!problema) {
      return res.status(404).json({ message: "Problema não encontrado" });
    }

    res.json(problema);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Listar problemas do professor logado
export const listarProblemasDoProfesor = async (req, res) => {
  try {
    const professorId = req.professor.id;
    const problemas = await Problema.find({ professor: professorId }).sort({
      createdAt: -1,
    });

    res.json(problemas);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Atualizar problema
export const atualizarProblema = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.professor.id;

    const problema = await Problema.findOne({
      _id: id,
      professor: professorId,
    });
    if (!problema) {
      return res
        .status(404)
        .json({ message: "Problema não encontrado ou sem permissão" });
    }

    const problemaAtualizado = await Problema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      message: "Problema atualizado com sucesso",
      problema: problemaAtualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Deletar problema
export const deletarProblema = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.professor.id;

    const problema = await Problema.findOne({
      _id: id,
      professor: professorId,
    });
    if (!problema) {
      return res
        .status(404)
        .json({ message: "Problema não encontrado ou sem permissão" });
    }

    await Problema.findByIdAndDelete(id);
    res.json({ message: "Problema deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};
