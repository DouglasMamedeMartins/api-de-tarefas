import { Request, Response } from "express";
import {
  createTaskService,
  deleteTaskService,
  getTaskByIdService,
  getTasksService,
  updateTaskService,
} from "../service/tasks.service";

export async function getTasks(req: Request, res: Response) {
  return res.status(200).json(await getTasksService());
}

export async function getTaskById(req: Request, res: Response) {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  const task = await getTaskByIdService(id);
  if (!task) {
    return res.status(404).json({
      message: "Tarefa não encontrada",
    });
  }

  return res.status(200).json(task);
}

export async function createTask(req: Request, res: Response) {
  if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
    return res.status(400).json({
      message: "Título inválido",
    });
  }

  return res.status(201).json(await createTaskService(req.body.title));
}

export async function updateTask(req: Request, res: Response) {
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
  }

  if ("completed" in req.body) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({
        message: "message deve ser true ou false",
      });
    }
  }

  const task = await updateTaskService(id, req.body);
  if (!task) {
    return res.status(404).json({
      message: "Tarefa não encontrada.",
    });
  }

  return res.status(200).json(task);
}

export async function deleteTask(req: Request, res: Response) {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  const taskExists = await deleteTaskService(id);
  if (!taskExists) {
    return res.status(404).json({
      message: "Tarefa não encontrada",
    });
  }

  return res.status(204).send();
}
