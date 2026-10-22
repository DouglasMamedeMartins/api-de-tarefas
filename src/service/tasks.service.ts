import { pool } from "../database/connections";

interface ServiceData {
  title?: string;
  completed?: boolean;
}

export async function getTasksService() {
  const result = await pool.query("SELECT * FROM tasks");
  return result.rows;
}

export async function getTaskByIdService(id: number) {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  return result.rows[0];
}

export async function createTaskService(title: string) {
  const newTask = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title],
  );

  return newTask.rows[0];
}

export async function updateTaskService(id: number, data: ServiceData) {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  const taskExists = result.rows[0];

  if (!taskExists) {
    return undefined;
  }

  const nextTitle = data.title !== undefined ? data.title : taskExists.title;
  const nextCompleted =
    data.completed !== undefined ? data.completed : taskExists.completed;

  const taskUpdated = await pool.query(
    "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *;",
    [nextTitle, nextCompleted, id],
  );

  return taskUpdated.rows[0];
}

export async function deleteTaskService(id: number) {
  const taskDeleted = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *;",
    [id],
  );
  return taskDeleted.rows[0];
}
