import { Project } from '../entities/Project';
import { Todo } from '../entities/Todo';

// Sample data for first load
const sampleData = {
    projects: [
        {
            id: 1,
            name: 'Work',
            todos: [
                {
                    id: 11,
                    title: 'Meeting with clients',
                    project: 'Work',
                    description: 'Discuss project requirements',
                    dueDate: '',
                    priority: 'high',
                    completed: true,
                },
                {
                    id: 22,
                    title: 'Prepare presentation',
                    project: 'Work',
                    description: 'Create slides for the upcoming presentation',
                    dueDate: '',
                    priority: 'medium',
                    completed: false,
                },
            ],
        },
        {
            id: 2,
            name: 'Personal',
            todos: [
                {
                    id: 33,
                    title: 'Go grocery shopping',
                    project: 'Personal',
                    description: 'Buy fruits, vegetables, and milk',
                    dueDate: '',
                    priority: 'high',
                    completed: true,
                },
                {
                    id: 44,
                    title: 'Gym workout',
                    project: 'Personal',
                    description: 'Cardio and weight training session',
                    dueDate: '',
                    priority: 'low',
                    completed: false,
                },
            ],
        },
        {
            id: 3,
            name: 'Home Improvement',
            todos: [
                {
                    id: 55,
                    title: 'Paint living room walls',
                    project: 'Home Improvement',
                    description: 'Choose paint color and buy supplies',
                    dueDate: '',
                    priority: 'medium',
                    completed: true,
                },
                {
                    id: 66,
                    title: 'Fix leaking faucet',
                    project: 'Home Improvement',
                    description: 'Call plumber to fix the kitchen faucet',
                    dueDate: '',
                    priority: 'high',
                    completed: true,
                },
            ],
        },
        {
            id: 4,
            name: 'Fitness Goals',
            todos: [
                {
                    id: 77,
                    title: 'Run 5 miles',
                    project: 'Fitness Goals',
                    description: 'Run in the park early morning',
                    dueDate: '',
                    priority: 'high',
                    completed: false,
                },
                {
                    id: 88,
                    title: 'Try new yoga class',
                    project: 'Fitness Goals',
                    description: 'Attend the evening yoga class at the gym',
                    dueDate: '',
                    priority: 'medium',
                    completed: false,
                },
            ],
        },
        {
            id: 5,
            name: 'Vacation Planning',
            todos: [
                {
                    id: 99,
                    title: 'Book flight tickets',
                    project: 'Vacation Planning',
                    description: 'Search for best deals and book tickets',
                    dueDate: '',
                    priority: 'high',
                    completed: false,
                },
                {
                    id: 1010,
                    title: 'Research accommodation options',
                    project: 'Vacation Planning',
                    description: 'Find suitable hotels or Airbnb',
                    dueDate: '',
                    priority: 'medium',
                    completed: false,
                },
                {
                    id: 1111,
                    title: 'Plan itinerary',
                    project: 'Vacation Planning',
                    description: 'Research attractions and create a travel plan',
                    dueDate: '',
                    priority: 'high',
                    completed: false,
                },
                {
                    id: 1212,
                    title: 'Pack luggage',
                    project: 'Vacation Planning',
                    description: 'Make a list of essentials and pack luggage',
                    dueDate: '',
                    priority: 'medium',
                    completed: false,
                },
                {
                    id: 1313,
                    title: 'Check travel documents',
                    project: 'Vacation Planning',
                    description: 'Ensure passports, visas, and tickets are ready',
                    dueDate: '',
                    priority: 'high',
                    completed: false,
                },
                {
                    id: 1414,
                    title: 'Confirm accommodation bookings',
                    project: 'Vacation Planning',
                    description: 'Double-check hotel or Airbnb reservations',
                    dueDate: '',
                    priority: 'medium',
                    completed: false,
                },
            ],
        },
    ],
};

// helper function to reformat Date to YYYY-MM-DD
function ymd(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Mutates the given projects' todos so that:
 * - Up to 3 todos per project are due today
 * - Remaining todos are spread one per day starting tomorrow
 * - Total window: today and next 13 days (14 days)
 */
function adjustDueDatesToIncludeCurrentDay(projects: Project[]): void {
    const totalDays = 14; // today and next 13 days

    // normalize "today" to local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const project of projects) {
        const count = project.todos.length;

        // first up to 3 todos -> today
        const todaysCount = Math.min(3, count);
        for (let i = 0; i < todaysCount; i++) {
            project.todos[i] = project.todos[i].setDueDate(ymd(today));
        }

        // spread the rest starting from tomorrow
        const currentDay = new Date(today);
        currentDay.setDate(currentDay.getDate() + 1);

        let todoIndex = todaysCount;
        for (let dayOffset = 1; dayOffset < totalDays && todoIndex < count; dayOffset++) {
            // assign date (clone to avoid aliasing)
            const assignDate = new Date(currentDay);
            project.todos[todoIndex] = project.todos[todoIndex].setDueDate(ymd(assignDate));
            todoIndex++;

            // advance one day
            currentDay.setDate(currentDay.getDate() + 1);
        }
    }
    console.log('adjust');
}

export function getSeedProjects(): Project[] {
    // build class instances
    const projects = sampleData.projects.map(
        project =>
            new Project(
                project.id,
                project.name,
                project.todos.map(
                    todo =>
                        new Todo(
                            todo.id,
                            todo.title,
                            todo.project,
                            todo.description,
                            todo.dueDate, // will be overwritten below
                            todo.priority as any,
                            todo.completed
                        )
                )
            )
    );

    // adjust due dates (local and correct spread)
    adjustDueDatesToIncludeCurrentDay(projects);

    return projects;
}
