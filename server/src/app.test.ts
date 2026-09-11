import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("tasks API", () => {
  it("reports health", async () => {
    const res = await request(createApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("starts with an empty task list", async () => {
    const res = await request(createApp()).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates, updates, and deletes a task", async () => {
    const app = createApp();

    const created = await request(app).post("/api/tasks").send({ title: "Lay the groundwork" });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Lay the groundwork");
    expect(created.body.done).toBe(false);

    const id = created.body.id;

    const toggled = await request(app).patch(`/api/tasks/${id}`).send({ done: true });
    expect(toggled.status).toBe(200);
    expect(toggled.body.done).toBe(true);

    const listed = await request(app).get("/api/tasks");
    expect(listed.body).toHaveLength(1);

    const removed = await request(app).delete(`/api/tasks/${id}`);
    expect(removed.status).toBe(204);

    const empty = await request(app).get("/api/tasks");
    expect(empty.body).toEqual([]);
  });

  it("rejects an empty title", async () => {
    const res = await request(createApp()).post("/api/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });
});
