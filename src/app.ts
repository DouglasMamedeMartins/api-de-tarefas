import express from "express";
import { createTasksRouter } from "./routes/tasks.routes";
import type { Pool } from "pg";

export function createApp(db: Pool) {
  const app = express();
  app.use(express.json());
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "API funcionando!",
    });
  });

  app.use("/api", createTasksRouter(db));

  return app;
}
