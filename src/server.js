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
  const tz = "America/Sao_Paulo";
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
  const h = get("hour");
  const m = get("minute");
  const s = get("second");

  const secNow = h * 3600 + m * 60 + s;
  const start = 10 * 3600; // 19:00:00
  const end = 23 * 3600; // 23:00:00

  const isAvailable = secNow >= start && secNow < end;

  let secToNext;
  if (isAvailable) {
    secToNext = 0;
  } else if (secNow < start) {
    secToNext = start - secNow; // hoje às 19h
  } else {
    secToNext = 24 * 3600 - secNow + start; // amanhã às 19h
  }

  const nextAvailableTime =
    secToNext > 0 ? new Date(now.getTime() + secToNext * 1000) : null;
  res.json({
    isAvailable,
    nextAvailableTime: nextAvailableTime
      ? nextAvailableTime.toISOString()
      : null,
    message: isAvailable
      ? "Plataforma disponível"
      : "Plataforma indisponível. Disponível apenas das 19h às 23h",
    serverNowISO: now.toISOString(),
    saoPauloClock: `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
  });
});

app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/problemas", problemaRoutes);
app.use("/api/submissoes", submissionRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
