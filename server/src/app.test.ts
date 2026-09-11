import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "./app.js";

describe("todos API", () => {
  it("reports health", async () => {
    const res = await request(createApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("starts with an empty list", async () => {
    const res = await request(createApp()).get("/api/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates, toggles, and deletes a todo", async () => {
    const app = createApp();

    const created = await request(app).post("/api/todos").send({ title: "write tests" });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ id: 1, title: "write tests", done: false });

    const toggled = await request(app).patch(`/api/todos/${created.body.id}`);
    expect(toggled.status).toBe(200);
    expect(toggled.body.done).toBe(true);

    const removed = await request(app).delete(`/api/todos/${created.body.id}`);
    expect(removed.status).toBe(204);

    const list = await request(app).get("/api/todos");
    expect(list.body).toEqual([]);
  });

  it("rejects an empty title", async () => {
    const res = await request(createApp()).post("/api/todos").send({ title: "  " });
    expect(res.status).toBe(400);
  });
});
