import express from "express";
import tasksRouter from "./routes/tasks.routes";

const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando!",
  });
});

app.use("/api", tasksRouter);

export default app;
