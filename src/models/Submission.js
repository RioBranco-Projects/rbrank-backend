// models/Submission.ts
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problema",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: true,
  },
  code: { type: String, required: true }, // código em texto
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Submission", submissionSchema);
