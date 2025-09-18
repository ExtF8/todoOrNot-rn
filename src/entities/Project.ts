import { Todo } from './Todo';

export class Project {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly todos: Todo[]
    ) {}

    add(todo: Todo): Project {
        return new Project(this.id, this.name, [todo, ...this.todos]);
    }

    mapTodo(id: number, fn: (todo: Todo) => Todo): Project {
        return new Project(
            this.id,
            this.name,
            this.todos.map(todo => (todo.id === id ? fn(todo) : todo))
        );
    }

    removeTodo(id: number): Project {
        return new Project(
            this.id,
            this.name,
            this.todos.filter(todo => todo.id !== id)
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            todos: this.todos.map(todo => todo.toJSON()),
        };
    }

    static fromJSON(raw: any): Project {
        const todos = Array.isArray(raw.todos) ? raw.todos.map(Todo.fromJSON) : [];
        return new Project(Number(raw.id), String(raw.name ?? ''), todos);
    }
}
