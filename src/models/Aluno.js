import mongoose from 'mongoose';

const alunoSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: true,
    trim: true
  },
  ra: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  semestre: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  pontuacao: {
    type: Number,
    default: 0
  },
  problemasResolvidos: [{
    problema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problema'
    },
    dataResolucao: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Aluno', alunoSchema);

