import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Project } from './src/entities/Project';
import { Todo } from './src/entities/Todo';
import { isDueToday, isDueThisWeek } from './src/services/filters';
import { loadProjects, saveProjects } from './src/storage/projectStorage';
import { getSeedProjects } from './src/sampleData/sampleData';
import TabBar from './src/ui/components/TabBar';
import HomeScreen from './src/ui/screens/HomeScreen';
import TodayScreen from './src/ui/screens/TodayScreen';
import WeekScreen from './src/ui/screens/WeekScreen';
import ProjectsScreen from './src/ui/screens/ProjectsScreen';
import EditTodoModal from './src/ui/components/EditTodoModal';
import type { Priority } from './src/entities/Todo';

// Create ids for todos
function createId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}

export default function App() {
    const [activeTab, setActiveTab] = useState<'Home' | 'Today' | 'Week' | 'Projects'>('Home');
    const [projects, setProjects] = useState<Project[]>([]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [selected, setSelected] = useState<{ id: number; projectName: string } | null>(null);

    // Load projects form storage or seed if empty
    useEffect(() => {
        async function hydrate() {
            const storedProjects = await loadProjects();
            if (storedProjects.length > 0) {
                setProjects(storedProjects);
            } else {
                setProjects(getSeedProjects());
            }
        }
        hydrate();
    }, []);

    // Save projects if they change
    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    // Flatten all todos across projects
    const allTodos: Todo[] = useMemo(() => projects.flatMap(project => project.todos), [projects]);

    // Derived filtered lists
    const todayTodos: Todo[] = useMemo(() => allTodos.filter(isDueToday), [allTodos]);
    const weekTodos: Todo[] = useMemo(() => allTodos.filter(isDueThisWeek), [allTodos]);

    /**
     * Add a new todo to a specific project by id.
     * This is reusable for any project once the UI supports project selection.
     */
    function addTodoToProject(projectId: number, title: string) {
        const cleanTitle = title.trim();
        if (cleanTitle.length === 0) return;

        const targetProject = projects.find(project => project.id === projectId);
        if (!targetProject) return;

        const newTodo = new Todo(
            createId(),
            cleanTitle,
            targetProject.name,
            '',
            '',
            'medium',
            false
        );

        setProjects(previousProjects =>
            previousProjects.map(project =>
                project.id === projectId ? project.add(newTodo) : project
            )
        );
    }

    /**
     * Toggle completion status of a todo by id and projectName.
     */
    function toggleTodo(todoId: number, projectName: string) {
        setProjects(previousProjects =>
            previousProjects.map(project =>
                project.name === projectName
                    ? project.mapTodo(todoId, todo => todo.toggle())
                    : project
            )
        );
    }

    /**
     * Delete a todo after confirm
     */
    function confirmDelete(todoId: number, projectName: string) {
        Alert.alert('Delete Todo?', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    setProjects(previousProjects =>
                        previousProjects.map(project =>
                            project.name === projectName ? project.removeTodo(todoId) : project
                        )
                    );
                },
            },
        ]);
    }

    /**
     * Open todo editor modal
     */
    function openEditor(todo: Todo) {
        setSelected({ id: todo.id, projectName: todo.project });
        setEditorVisible(true);
    }

    const selectedTodo: Todo | null = useMemo(() => {
        if (!selected) return null;
        for (const project of projects) {
            if (project.name !== selected.projectName) continue;
            const found = project.todos.find(t => t.id === selected.id);
            if (found) return found;
        }
        return null;
    }, [selected, projects]);

    function closeEditor() {
        setEditorVisible(false);
        setSelected(null);
    }

    function saveEdits(changes: {
        title: string;
        description: string;
        dueDate: string | null;
        priority: Priority;
        completed: boolean;
    }) {
        if (!selected) return;
        const { id, projectName } = selected;

        setProjects(previousProjects =>
            previousProjects.map(project =>
                project.name === projectName
                    ? project.mapTodo(id, todo => todo.update(changes))
                    : project
            )
        );

        closeEditor();
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto' />
            <View style={styles.header}>
                <Text style={styles.title}>ToDo or Not</Text>
            </View>

            <TabBar active={activeTab} onChange={setActiveTab}></TabBar>

            <View style={{ flex: 1 }}>
                {activeTab === 'Home' && (
                    <HomeScreen
                        todos={allTodos}
                        // For now adds to first project
                        onAdd={(title: string) => {
                            if (projects.length === 0) return;
                            addTodoToProject(projects[0].id, title);
                        }}
                        onToggle={toggleTodo}
                        onDelete={confirmDelete}
                        onEdit={openEditor}
                    />
                )}

                {activeTab === 'Today' && (
                    <TodayScreen
                        todos={todayTodos}
                        onToggle={toggleTodo}
                        onDelete={confirmDelete}
                        onEdit={openEditor}
                    />
                )}

                {activeTab === 'Week' && (
                    <WeekScreen
                        todos={weekTodos}
                        onToggle={toggleTodo}
                        onDelete={confirmDelete}
                        onEdit={openEditor}
                    />
                )}

                {activeTab === 'Projects' && (
                    <ProjectsScreen projects={projects} onSelect={() => setActiveTab('Home')} />
                )}
            </View>
            <EditTodoModal
                visible={editorVisible}
                todo={selectedTodo}
                onClose={closeEditor}
                onSave={saveEdits}
                onDelete={
                    selected
                        ? () => {
                              confirmDelete(selected.id, selected.projectName);
                              closeEditor();
                          }
                        : undefined
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 30,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
});
