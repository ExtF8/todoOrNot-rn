export type Priority = 'low' | 'medium' | 'high';

export class Todo {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly project: string,
        public readonly description: string,
        public readonly dueDate: string | null,
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

    rename(newTitle: string): Todo {
        const trimmedTitle = newTitle.trim();
        if (trimmedTitle.length === 0) {
            return this;
        }
        return new Todo(
            this.id,
            trimmedTitle,
            this.project,
            this.description,
            this.dueDate,
            this.priority,
            !this.compleded
        );
    }

    update(fields: {
        title?: string;
        description?: string;
        dueDate?: string | null;
        priority?: Priority;
        completed?: boolean;
    }): Todo {
        let newTitle = this.title;
        let newDescription = this.description;
        let newDueDate = this.dueDate;
        let newPriority = this.priority;
        let newCompleted = this.compleded;

        if (fields.title !== undefined) {
            newTitle = fields.title;
        }
        if (fields.description !== undefined) {
            newDescription = fields.description;
        }
        if (fields.dueDate !== undefined) {
            newDueDate = fields.dueDate;
        }
        if (fields.priority !== undefined) {
            newPriority = fields.priority;
        }
        if (fields.completed !== undefined) {
            newCompleted = fields.completed;
        }

        // Return new Todo instance with updated values
        return new Todo(
            this.id,
            newTitle,
            this.project,
            newDescription,
            newDueDate,
            newPriority,
            newCompleted
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
