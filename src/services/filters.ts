import { isToday, isThisWeek, parseISO } from 'date-fns';
import { Todo } from '../entities/Todo';

function parseYmd(ymd: string | null): Date | null {
    // If no due date set, then Todo has no time limit
    if (!ymd) {
        return null;
    }

    try {
        return parseISO(ymd);
    } catch {
        return null;
    }
}

export function isDueToday(todo: Todo): boolean {
    const dueDate = parseYmd(todo.dueDate);
    return dueDate ? isToday(dueDate) : false;
}

export function isDueThisWeek(todo: Todo): boolean {
    const dueDate = parseYmd(todo.dueDate);
    return dueDate ? isThisWeek(dueDate, { weekStartsOn: 1 }) : false; // Week starts with Monday
}
