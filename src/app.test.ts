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

  it("(PATCH /api/task/:id) deve retornar 200", async () => {
    const task = {
      title: "Javascript",
    };
    await request(app).post("/api/tasks").send(task);
    const getResponse = await request(app).get("/api/tasks");
    expect(getResponse.status).toBe(200);
    expect(getResponse.body[0].title).toBe(task.title);

    const idTask = await request(app).get(
      `/api/tasks/${getResponse.body[0].id}`,
    );

    const taskUpdate = {
      title: "PHP",
      completed: true,
    };

    expect(getResponse.body[0].id).toBe(idTask.body.id);

    const responseUpdate = await request(app)
      .patch(`/api/tasks/${idTask.body.id}`)
      .send(taskUpdate);

    expect(responseUpdate.status).toBe(200);
    expect(responseUpdate.body.title).toBe(taskUpdate.title);
    expect(responseUpdate.body.completed).toBe(true);

    const getResponseUpdate = await request(app).get("/api/tasks");

    expect(getResponseUpdate.body[0].title).toBe(taskUpdate.title);
    expect(getResponseUpdate.body[0].completed).toBe(taskUpdate.completed);
  });

  it("(DELETE  /api/tasks/:id) deve retornar 200", async () => {
    const task = {
      title: "Tarefa comum",
    };

    const responseCreate = await request(app).post("/api/tasks").send(task);

    const idTask = await request(app).get(
      `/api/tasks/${responseCreate.body.id}`,
    );

    const responseDelete = await request(app).delete(
      `/api/tasks/${idTask.body.id}`,
    );
    expect(responseDelete.status).toBe(200);

    const responseGet = await request(app).get(`/api/tasks/${idTask.body.id}`);
    expect(responseGet.status).toBe(404);
  });

  it("(POST /api/tasks) deve retornar 400 caso título seja vazio", async () => {
    const task = {
      title: "",
    };
    const response = await request(app).post("/api/tasks").send(task);
    expect(response.status).toBe(400);
  });

  it("(POST /api/tasks) deve retornar 400 caso título seja inválido", async () => {
    const task = {
      title: 123,
    };
    const response = await request(app).post("/api/tasks").send(task);
    expect(response.status).toBe(400);
  });

  it("(POST /api/tasks) deve retornar 400 caso título tenha mais que 200 caracteres", async () => {
    const task = {
      title: "A".repeat(201),
    };
    const response = await request(app).post("/api/tasks").send(task);
    expect(response.status).toBe(400);

    const getResponse = await request(app).get("/api/tasks");
    expect(getResponse.body).toHaveLength(0);
  });
});
