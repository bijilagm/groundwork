export interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

/**
 * Simple in-memory store for the starter app. Swap for a real database
 * when the project grows beyond the groundwork stage.
 */
export class TodoStore {
  private todos: Todo[] = [];
  private nextId = 1;

  list(): Todo[] {
    return [...this.todos];
  }

  add(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: number): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return undefined;
    todo.done = !todo.done;
    return todo;
  }

  remove(id: number): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }
}
