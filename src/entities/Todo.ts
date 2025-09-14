export type Priority = 'low' | 'medium' | 'high';

export class Todo {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly project: string,
        public readonly description: string,
        public readonly dueDate: string,
        public readonly priority: Priority,
        public readonly compleded: boolean
    ) {}

    toggle(): Todo {
        return new Todo(
            this.id,
            this.title,
            this.project,
            this.description,
            this.dueDate,
            this.priority,
            !this.compleded
        );
    }

    // ymd: year, month, day
    setDueDate(ymd: string): Todo {
        return new Todo(
            this.id,
            this.title,
            this.project,
            this.description,
            ymd,
            this.priority,
            this.compleded
        );
    }

    setProiority(priority: Priority): Todo {
        return new Todo(
            this.id,
            this.title,
            this.project,
            this.description,
            this.dueDate,
            priority,
            this.compleded
        );
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            project: this.project,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            compleded: this.compleded,
        };
    }

    static fromJSON(raw: any): Todo {
        return new Todo(
            Number(raw.id),
            String(raw.title ?? ''),
            String(raw.project ?? ''),
            String(raw.description ?? ''),
            String(raw.dueDate ?? ''),
            (raw.priority as Priority) ?? 'medium',
            Boolean(raw.compleded)
        );
    }
}
