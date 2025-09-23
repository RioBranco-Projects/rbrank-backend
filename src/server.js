import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import alunoRoutes from "./routes/alunoRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import problemaRoutes from "./routes/problemaRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("RioBrancoRank API is running...");
});

app.get("/api/status", (req, res) => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;
  const start = 19 * 60;
  const end = 23 * 60;
  const isAvailable = totalMinutes >= start && totalMinutes < end;
  let nextAvailableTime = null;
  if (!isAvailable) {
    nextAvailableTime = new Date(now);
    if (totalMinutes < start) {
      nextAvailableTime.setHours(19, 0, 0, 0);
    } else {
      nextAvailableTime.setDate(nextAvailableTime.getDate() + 1);
      nextAvailableTime.setHours(19, 0, 0, 0);
    }
  }
  res.json({
    isAvailable,
    currentTime: now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    nextAvailableTime: nextAvailableTime
      ? nextAvailableTime.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })
      : null,
    message: isAvailable
      ? "✅ Plataforma disponível"
      : "⛔ Plataforma indisponível. Disponível apenas das 19h às 23h.",
  });
});
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/problemas", problemaRoutes);
app.use("/api/submissoes", submissionRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
