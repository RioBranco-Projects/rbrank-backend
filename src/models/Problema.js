import mongoose from "mongoose";

const problemaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    nivel: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // 1 = fácil, 2 = médio, 3 = difícil
      default: 1,
    },
    pontos: {
      type: Number,
      required: true,
      default: function () {
        // 1 ponto para nível 1, 3 pontos para nível 2, 5 pontos para nível 3
        return this.nivel === 1 ? 1 : this.nivel === 2 ? 3 : 5;
      },
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Problema", problemaSchema);
