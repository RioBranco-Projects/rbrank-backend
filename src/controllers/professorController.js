import Professor from "../models/Professor.js";
import jwt from "jsonwebtoken";

// Gerar JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Login do professor
export const loginProfessor = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const professor = await Professor.findOne({ nome });

    if (professor && (await professor.matchPassword(senha))) {
      res.json({
        _id: professor._id,
        nome: professor.nome,
        token: generateToken(professor._id),
      });
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Cadastrar professor (apenas para desenvolvimento/teste)
export const cadastrarProfessor = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const professorExistente = await Professor.findOne({ nome });
    if (professorExistente) {
      return res.status(400).json({ message: "Professor já cadastrado" });
    }

    const professor = new Professor({
      nome,
      senha,
    });

    await professor.save();

    res.status(201).json({
      _id: professor._id,
      nome: professor.nome,
      token: generateToken(professor._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};
