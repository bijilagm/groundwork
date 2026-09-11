import cors from "cors";
import express, { type Request, type Response } from "express";
import { TaskStore } from "./tasks.js";

export function createApp(store: TaskStore = new TaskStore()) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/tasks", (_req: Request, res: Response) => {
    res.json(store.list());
  });

  app.post("/api/tasks", (req: Request, res: Response) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    res.status(201).json(store.create(title));
  });

  app.patch("/api/tasks/:id", (req: Request, res: Response) => {
    const patch: { title?: string; done?: boolean } = {};
    if (typeof req.body?.title === "string") patch.title = req.body.title.trim();
    if (typeof req.body?.done === "boolean") patch.done = req.body.done;

    const updated = store.update(req.params.id, patch);
    if (!updated) {
      res.status(404).json({ error: "task not found" });
      return;
    }
    res.json(updated);
  });

  app.delete("/api/tasks/:id", (req: Request, res: Response) => {
    if (!store.remove(req.params.id)) {
      res.status(404).json({ error: "task not found" });
      return;
    }
    res.status(204).end();
  });

  return app;
}
