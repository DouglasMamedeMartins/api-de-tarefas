import type { Pool } from "pg";

interface ServiceData {
  title?: string;
  completed?: boolean;
}

export async function getTasksService(db: Pool) {
  const result = await db.query("SELECT * FROM tasks");
  return result.rows;
}

export async function getTaskByIdService(db: Pool, id: number) {
  const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);

  return result.rows[0];
}

export async function createTaskService(db: Pool, title: string) {
  const newTask = await db.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title],
  );

  return newTask.rows[0];
}

export async function updateTaskService(
  db: Pool,
  id: number,
  data: ServiceData,
) {
  const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);

  const taskExists = result.rows[0];

  if (!taskExists) {
    return undefined;
  }

  const nextTitle = data.title !== undefined ? data.title : taskExists.title;
  const nextCompleted =
    data.completed !== undefined ? data.completed : taskExists.completed;

  const taskUpdated = await db.query(
    "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *;",
    [nextTitle, nextCompleted, id],
  );

  return taskUpdated.rows[0];
}

export async function deleteTaskService(db: Pool, id: number) {
  const taskDeleted = await db.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *;",
    [id],
  );
  return taskDeleted.rows[0];
}
