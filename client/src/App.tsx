import { useEffect, useMemo, useState } from "react";
import { api, type Task } from "./api.js";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  async function addTask(event: React.FormEvent) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    try {
      const task = await api.createTask(value);
      setTasks((prev) => [...prev, task]);
      setTitle("");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function toggle(task: Task) {
    try {
      const updated = await api.toggleTask(task.id, !task.done);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(task: Task) {
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <div className="app__mark" aria-hidden="true">
          ▲
        </div>
        <div>
          <h1>Groundwork</h1>
          <p className="app__subtitle">A full-stack TypeScript starter</p>
        </div>
      </header>

      <section className="card">
        <form className="composer" onSubmit={addTask}>
          <input
            className="composer__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            aria-label="New task title"
          />
          <button className="composer__button" type="submit">
            Add task
          </button>
        </form>

        {error && <p className="alert" role="alert">{error}</p>}

        {loading ? (
          <p className="muted">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks yet — add your first one above.</p>
        ) : (
          <ul className="tasks">
            {tasks.map((task) => (
              <li key={task.id} className={`task ${task.done ? "task--done" : ""}`}>
                <label className="task__label">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggle(task)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  className="task__delete"
                  onClick={() => remove(task)}
                  aria-label={`Delete ${task.title}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="card__footer muted">
          {tasks.length} task{tasks.length === 1 ? "" : "s"} · {remaining} remaining
        </footer>
      </section>
    </main>
  );
}
