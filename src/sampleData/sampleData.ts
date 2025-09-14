import { Project } from '../entities/Project';
import { Todo } from '../entities/Todo';

// Sample data to load
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
 * Adjusts the due dates of todos in the sample data to distribute them evenly across the current week.
 * The week starts on Monday.
 */
export function getSeedProjects(): Project[] {
    // Get current date and normalize to start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Set up the total number of days (current week + next week)
    const totalDays = 14;

    // Convert plain objects into Project/Todo class instances
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
                            todo.dueDate,
                            todo.priority as any,
                            todo.completed
                        )
                )
            )
    );

    // 4. Iterate over projects and assign due dates
    for (const project of projects) {
        const totalTodos = project.todos.length;

        // Assign some todos to today (up to 3)
        const todosForToday = Math.min(3, totalTodos);
        for (let i = 0; i < todosForToday; i++) {
            project.todos[i] = project.todos[i].setDueDate(ymd(currentDate));
        }

        // Start date reference for spreading remaining todos
        let currentDay = new Date(currentDate);

        // Distribute the rest across the next 13 days
        let currentTodoIndex = todosForToday;
        for (let dayOffset = 1; dayOffset < totalDays; dayOffset++) {
            if (currentTodoIndex >= totalTodos) break;

            // Create a new Date for this offset
            const dueDate = new Date(currentDay);
            project.todos[currentTodoIndex] = project.todos[currentTodoIndex].setDueDate(
                ymd(dueDate)
            );
            currentTodoIndex++;

            // Increment day reference for next loop
            currentDay.setDate(currentDay.getDate() + 1);
        }
    }

    return projects;
}
