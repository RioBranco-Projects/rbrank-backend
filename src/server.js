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
  const isAvailable = hour >= 19 && hour < 23;
  let nextAvailableTime;
  if (hour < 19) {
    nextAvailableTime = new Date();
    nextAvailableTime.setHours(19, 0, 0, 0);
  } else if (hour >= 23) {
    nextAvailableTime = new Date();
    nextAvailableTime.setDate(nextAvailableTime.getDate() + 1);
    nextAvailableTime.setHours(19, 0, 0, 0);
  }
  res.json({
    isAvailable,
    currentHour: hour,
    nextAvailableTime: nextAvailableTime
      ? nextAvailableTime.toISOString()
      : null,
    message: isAvailable
      ? "Plataforma disponível"
      : "Aplicação disponível somente no horário letivo (19h às 23h)",
  });
});

app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/problemas", problemaRoutes);
app.use("/api/submissoes", submissionRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
