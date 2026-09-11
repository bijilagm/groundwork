export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

/**
 * In-memory task store. Intentionally simple so the starter runs with zero
 * external infrastructure; swap this out for a real database when needed.
 */
export class TaskStore {
  private tasks = new Map<string, Task>();

  list(): Task[] {
    return [...this.tasks.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  create(title: string): Task {
    const task: Task = {
      id: globalThis.crypto.randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, patch: Partial<Pick<Task, "title" | "done">>): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    this.tasks.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.tasks.delete(id);
  }
}
