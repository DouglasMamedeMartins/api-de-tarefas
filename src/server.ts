import { pool } from "./database/connections";
import { createApp } from "./app";
const PORT = 3000;

const app = createApp(pool);

pool
  .query("SELECT NOW ()")
  .then((result) => {
    console.log("Conexão com PostgreSQL funcionando!");
    console.log("Horário do Banco:", result.rows[0].now);
  })
  .catch((error) => {
    console.log("Erro ao conectar com PostgreSQL", error);
  });
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
