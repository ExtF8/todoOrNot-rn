# ToDo or Not (React Native Demo)

A simple **To-Do list demo app** built with **React Native**, **Expo**, and **TypeScript**.  
The app is inspired by the original [todoOrNot (web version)](https://github.com/ExtF8/todoOrNot) and reimagined for mobile.

This project demonstrates:

-   Adding, editing, deleting todos
-   Marking todos as completed / not completed
-   Organizing todos into projects
-   Filtering todos by **Today** and **This Week**
-   Local storage with **AsyncStorage** (data persists across app restarts)
-   **Sample demo data** that automatically refreshes due dates on each launch (so the app always looks alive)
-   Color-coded priorities: **Low = green, Medium = yellow, High = red**
-   Modal editor with project picker, priority chips, date picker, and status toggle
-   FlatList with press feedback for good mobile UX

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/ExtF8/todoOrNot-mobile.git
cd todoOrNot-mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run with Expo

```bash
npm start
```

This will open the Expo Dev Tools in your browser.
From there, you can run the app on:

iOS Simulator (macOS only)

Android Emulator

Expo Go app on a physical device

## Project Structure
    ├── App.tsx # Root component, tab navigation, data loading
    ├── src/
    │ ├── entities/ # Core domain classes (Project, Todo)
    │ ├── sampleData/ # Seed data + date adjuster
    │ ├── services/ # Filtering logic (today, week)
    │ ├── storage/ # AsyncStorage load/save helpers
    │ └── ui/
    │ ├── components/ # UI building blocks (TodoRow, EditTodoModal, TabBar, etc.)
    │ └── screens/ # Screen-level components (Home, Today, Week, Projects)
    └── README.md

## Core Concepts
Entities

Project
Holds an array of Todo items and helper methods (add, removeTodo, mapTodo).

Todo
Represents a single task with fields:

-   id: number

-   title: string

-   project: string

-   description: string

-   dueDate: string | null

-   priority: 'low' | 'medium' | 'high'

-   completed: boolean

Sample Data & Adjusted Dates

On each app launch:

-   The app loads stored projects from AsyncStorage if available.

-   If none are found, it seeds with demo data (getSeedProjects()).

-   The helper adjustDueDatesToIncludeCurrentDay ensures that sample todos always have fresh due dates, spreading them across today and the next 13 days.

-   This makes the demo always feel “active”, even without user input.

## Storage

-   AsyncStorage is used for persistence.

-   User-added todos and changes are always saved.

-   Sample todos get re-adjusted dates each launch.

## Features

Home tab
-   Shows all todos. “Add new” opens modal editor.

Today tab
-   Filters todos due today.

Week tab
-   Filters todos due this week.

Projects tab
-   Shows all projects. Selecting one displays its todos inline with a Back button.

Modal Editor

-   Title, description

-   Project picker

-   Due date input + native date picker

-   Priority chips with colors (green/yellow/red)

-   Status toggle (Open / Done)

-   Save / Cancel / Delete

## Development Notes
Priority Colors

-   Low: Green #22C55E

-   Medium: Yellow #EAB308

-   High: Red #DC2626

Used in TodoRow and EditTodoModal.

## Known Limitations

-   No cross-device sync (local-only via AsyncStorage).

-   Sample todos overwrite their due dates on every launch (intended for demo).

-   Project names are unique (not enforced in UI yet).

-   No animations or advanced theming.

## TODOs / Future Improvements

-   Add search & filtering inside projects.

-   Add project creation/deletion in UI.

-   Add reminders/notifications for due dates.

-   Better error handling for storage failures.

-   Polish design (currently minimal).

