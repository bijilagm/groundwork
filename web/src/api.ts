export interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  list: () => fetch("/api/todos").then((r) => json<Todo[]>(r)),
  add: (title: string) =>
    fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then((r) => json<Todo>(r)),
  toggle: (id: number) =>
    fetch(`/api/todos/${id}`, { method: "PATCH" }).then((r) => json<Todo>(r)),
  remove: (id: number) =>
    fetch(`/api/todos/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
    }),
};
