import { it, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { testPool } from "./database/connections";
import { createApp } from "./app";

const app = createApp(testPool);

describe("Testes da API de tarefas", () => {
  beforeEach(async () => {
    await testPool.query("DELETE FROM tasks;");
  });

  it("(GET /health) deve retornar 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("API funcionando!");
  });

  it("(GET /api/tasks/:id) deve retornar 404 quando uma tarefa não for encontrada", async () => {
    const response = await request(app).get("/api/tasks/999999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Tarefa não encontrada");
  });

  it("(GET /api/tasks) deve retornar 200", async () => {
    const task1 = {
      title: "Express",
    };

    const task2 = {
      title: "React",
    };

    await request(app).post("/api/tasks").send(task1);
    await request(app).post("/api/tasks").send(task2);

    const getResponse = await request(app).get("/api/tasks");
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toBeInstanceOf(Array);
    expect(getResponse.body).toHaveLength(2);
    expect(getResponse.body[0].title).toBe(task1.title);
    expect(getResponse.body[1].title).toBe(task2.title);
  });

  it("(POST /api/tasks) deve retornar 201", async () => {
    const task = {
      title: "Estudar Node.js",
    };
    const response = await request(app).post("/api/tasks").send(task);

    expect(response.status).toBe(201);
    expect(response.body.completed).toBe(false);
    expect(response.body.title).toBe(task.title);
  });

  it("(PATCH /api/task/:id)", async () => {});
});
