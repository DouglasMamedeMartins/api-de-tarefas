import { Request, Response } from "express";
import {
  createTaskService,
  deleteTaskService,
  getTaskByIdService,
  getTasksService,
  updateTaskService,
} from "../service/tasks.service";
import type { Pool } from "pg";

export function createGetTasksController(db: Pool) {
  return async (req: Request, res: Response) => {
    res.status(200).json(await getTasksService(db));
  };
}

export function createGetTaskByIdController(db: Pool) {
  return async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const task = await getTaskByIdService(db, id);
    if (!task) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    return res.status(200).json(task);
  };
}

export function createCreateTaskController(db: Pool) {
  return async (req: Request, res: Response) => {
    if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
      return res.status(400).json({
        message: "Título inválido",
      });
    }

    if (req.body.title.length > 200) {
      return res.status(400).json({
        message: "Limite de 200 caracteres atingido",
      });
    }

    return res.status(201).json(await createTaskService(db, req.body.title));
  };
}

export function createUpdateTaskController(db: Pool) {
  return async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID inválido.",
      });
    }

    if ("title" in req.body) {
      if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
        return res.status(400).json({
          message: "title deve ser uma string ou não pode estar vazio",
        });
      }

      if (req.body.title.length > 200) {
        return res.status(400).json({
          message: "Limite de 200 caracteres atingido",
        });
      }
    }

    if ("completed" in req.body) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
          message: "message deve ser true ou false",
        });
      }
    }

    const task = await updateTaskService(db, id, req.body);
    if (!task) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    return res.status(200).json(task);
  };
}

export function createDeleteTaskController(db: Pool) {
  return async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const taskExists = await deleteTaskService(db, id);
    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    return res.status(200).send();
  };
}
