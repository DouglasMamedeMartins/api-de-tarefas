import { it, describe, expect } from "vitest";
import request from "supertest";
import { testPool } from "./database/connections";
import { createApp } from "./app";
import { beforeEach } from "node:test";

const app = createApp(testPool);

beforeEach(async () => {
  await testPool.query("DELETE FROM tasks;");
});

describe("GET /health", () => {
  it("Deve retornar 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("API funcionando!");
  });
});

describe("GET /api/tasks/:id", () => {
  it("Deve retornar 404 quando uma tarefa não for encontrada", async () => {
    const response = await request(app).get("/api/tasks/999999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Tarefa não encontrada");
  });
});

describe("POST /api/tasks", () => {
  it("Deve retornar 201", async () => {
    const task = {
      title: "Estudar Node.js",
    };
    const response = await request(app).post("/api/tasks").send(task);

    expect(response.status).toBe(201);
    expect(response.body.completed).toBe(false);
    expect(response.body.title).toBe(task.title);
  });
});
