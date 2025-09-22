import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
professorSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Compare password method
professorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.senha);
};

export default mongoose.model('Professor', professorSchema);

