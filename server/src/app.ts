import cors from "cors";
import express, { type Express } from "express";

import { TodoStore } from "./todos.js";

export function createApp(store: TodoStore = new TodoStore()): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/todos", (_req, res) => {
    res.json(store.list());
  });

  app.post("/api/todos", (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    res.status(201).json(store.add(title));
  });

  app.patch("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = store.toggle(id);
    if (!todo) {
      res.status(404).json({ error: "todo not found" });
      return;
    }
    res.json(todo);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!store.remove(id)) {
      res.status(404).json({ error: "todo not found" });
      return;
    }
    res.status(204).end();
  });

  return app;
}
