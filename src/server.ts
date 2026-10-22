import express from "express";
import tasksRouter from "./routes/tasks.routes";
import { pool } from "./database/connections";
const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando!",
  });
});

app.use("/api", tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

pool
  .query("SELECT NOW ()")
  .then((result) => {
    console.log("Conexão com PostgreSQL funcionando!");
    console.log("Horário do Banco:", result.rows[0].now);
  })
  .catch((error) => {
    console.log("Erro ao conectar com PostgreSQL", error);
  });
