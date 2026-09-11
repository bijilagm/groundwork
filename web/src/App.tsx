import { useEffect, useState } from "react";

import { api, type Todo } from "./api.js";

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .list()
      .then(setTodos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    try {
      const created = await api.add(value);
      setTodos((prev) => [...prev, created]);
      setTitle("");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleToggle(id: number) {
    const updated = await api.toggle(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleRemove(id: number) {
    await api.remove(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main className="app">
      <header className="app__header">
        <h1>groundwork</h1>
        <p className="app__subtitle">A full-stack TypeScript starter — Express API + React client.</p>
      </header>

      <form className="composer" onSubmit={handleAdd}>
        <input
          className="composer__input"
          value={title}
          placeholder="What needs doing?"
          aria-label="New todo"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="composer__button" type="submit">
          Add
        </button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="muted">No todos yet. Add your first one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo ${todo.done ? "todo--done" : ""}`}>
              <label className="todo__label">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <span>{todo.title}</span>
              </label>
              <button
                className="todo__delete"
                aria-label={`Delete ${todo.title}`}
                onClick={() => handleRemove(todo.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="app__footer">
        {todos.length > 0 && <span>{remaining} remaining</span>}
      </footer>
    </main>
  );
}
