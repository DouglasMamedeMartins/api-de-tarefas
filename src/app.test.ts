import { it, describe, expect } from "vitest";
import request from "supertest";
import { testPool } from "./database/connections";
import { createApp } from "./app";

const app = createApp(testPool);

describe("GET /health", () => {
  it("Deve retornar 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("API funcionando!");
  });
});

describe("GET /api/tasks/:id", () => {
  it("Deve retornar 404 quando uma tarefa não for encontada", async () => {
    const response = await request(app).get("/api/tasks/999999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Tarefa não encontrada");
  });
});
