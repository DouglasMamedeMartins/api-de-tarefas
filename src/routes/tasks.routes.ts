import { Router } from "express";
import {
  createCreateTaskController,
  createDeleteTaskController,
  createGetTaskByIdController,
  createGetTasksController,
  createUpdateTaskController,
} from "../controllers/tasks.controller";
import type { Pool } from "pg";

export function createTasksRouter(db: Pool) {
  const router = Router();

  const getTasks = createGetTasksController(db);

  const getTasksById = createGetTaskByIdController(db);

  const createTask = createCreateTaskController(db);

  const updateTask = createUpdateTaskController(db);

  const deleteTask = createDeleteTaskController(db);

  router.get("/tasks", getTasks);

  router.get("/tasks/:id", getTasksById);

  router.post("/tasks", createTask);

  router.patch("/tasks/:id", updateTask);

  router.delete("/tasks/:id", deleteTask);

  return router;
}
