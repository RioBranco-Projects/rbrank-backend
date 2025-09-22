import mongoose from "mongoose";
import dotenv from "dotenv";
import Professor from "./models/Professor.js";
import Problema from "./models/Problema.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected for seeding...");

    // Limpar dados existentes
    await Professor.deleteMany({});
    await Problema.deleteMany({});

    // Criar professor de teste
    const professor = new Professor({
      nome: "test",
      senha: "123456",
    });

    await professor.save();
    console.log("Professor criado:", professor.nome);

    // Criar 3 problemas de nível 1
    const problemas = [
      {
        titulo: "Soma de Dois Números",
        descricao:
          "Escreva um programa que leia dois números inteiros e retorne a soma deles.\n\nExemplo:\nEntrada: 5 e 3\nSaída: 8",
        nivel: 1,
        solucaoEsperada: "8",
        professor: professor._id,
      },
      {
        titulo: "Número Par ou Ímpar",
        descricao:
          "Escreva um programa que leia um número inteiro e determine se ele é par ou ímpar.\n\nExemplo:\nEntrada: 4\nSaída: par",
        nivel: 1,
        solucaoEsperada: "par",
        professor: professor._id,
      },
      {
        titulo: "Maior de Três Números",
        descricao:
          "Escreva um programa que leia três números inteiros e retorne o maior deles.\n\nExemplo:\nEntrada: 10, 5, 8\nSaída: 10",
        nivel: 1,
        solucaoEsperada: "10",
        professor: professor._id,
      },
    ];

    for (const problemaData of problemas) {
      const problema = new Problema(problemaData);
      await problema.save();
      console.log("Problema criado:", problema.titulo);
    }

    console.log("Dados iniciais criados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar dados iniciais:", error);
    process.exit(1);
  }
};

seedData();
