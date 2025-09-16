import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Project } from './src/entities/Project';
import { Todo, Priority } from './src/entities/Todo';
import { isDueToday, isDueThisWeek } from './src/services/filters';
import { loadProjects, saveProjects } from './src/storage/projectStorage';
import { getSeedProjects } from './src/sampleData/sampleData';
import TabBar from './src/ui/components/TabBar';
import HomeScreen from './src/ui/screens/HomeScreen';
import TodayScreen from './src/ui/screens/TodayScreen';
import WeekScreen from './src/ui/screens/WeekScreen';
import ProjectsScreen from './src/ui/screens/ProjectsScreen';
import EditTodoModal from './src/ui/components/EditTodoModal';

// Create ids for todos
function createId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}

type Tab = 'Home' | 'Today' | 'Week' | 'Projects';
type EditorMode = 'create' | 'edit';

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('Home');
    const [projects, setProjects] = useState<Project[]>([]);

    // Editor state
    const [editorMode, setEditorMode] = useState<EditorMode>('edit');
    const [editorVisible, setEditorVisible] = useState(false);
    const [selectedTodoRef, setSelectedTodoRef] = useState<{
        id: number;
        projectName: string;
    } | null>(null);
    const [draftTitle, setDraftTitle] = useState<string>('');
    const [draftProjectId, setDraftProjectId] = useState<number | null>(null);

    // Load projects or seed
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

    // Persist changes
    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    // Flatten all todos
    const allTodos: Todo[] = useMemo(() => projects.flatMap(project => project.todos), [projects]);

    // Derived lists
    const todayTodos = useMemo(() => allTodos.filter(isDueToday), [allTodos]);
    const weekTodos = useMemo(() => allTodos.filter(isDueThisWeek), [allTodos]);

    /** Add a new todo into a project */
    function addTodoToProject(projectId: number, title: string): number | null {
        const cleanTitle = title.trim();
        if (cleanTitle.length === 0) return null;

        const targetProject = projects.find(project => project.id === projectId);
        if (!targetProject) return null;

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

        return newTodo.id;
    }

    /** Toggle completion */
    function toggleTodo(todoId: number, projectName: string) {
        setProjects(previousProjects =>
            previousProjects.map(project =>
                project.name === projectName
                    ? project.mapTodo(todoId, todo => todo.toggle())
                    : project
            )
        );
    }

    /** Confirm delete */
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

    /** Open editor for existing todo */
    function openEditor(todo: Todo) {
        setSelectedTodoRef({ id: todo.id, projectName: todo.project });
        setEditorMode('edit');
        setEditorVisible(true);
    }

    // Project choices for modal
    const projectChoices = useMemo(
        () => projects.map(project => ({ id: project.id, name: project.name })),
        [projects]
    );

    // Find currently selected todo
    const selectedTodo: Todo | null = useMemo(() => {
        if (!selectedTodoRef) return null;
        const project = projects.find(project => project.name === selectedTodoRef.projectName);
        return project?.todos.find(todo => todo.id === selectedTodoRef.id) ?? null;
    }, [selectedTodoRef, projects]);

    function closeEditor() {
        setEditorVisible(false);
        setSelectedTodoRef(null);
        setDraftTitle('');
        setDraftProjectId(null);
    }

    function saveEdits(payload: {
        projectId: number;
        title: string;
        description: string;
        dueDate: string | null;
        priority: Priority;
        completed: boolean;
    }) {
        if (editorMode === 'create') {
            const newId = addTodoToProject(payload.projectId, payload.title);
            if (newId != null) {
                // update newly created by id
                setProjects(previousProjects =>
                    previousProjects.map(project =>
                        project.id === payload.projectId
                            ? project.mapTodo(newId, todo =>
                                  todo.update({
                                      description: payload.description,
                                      dueDate: payload.dueDate,
                                      priority: payload.priority,
                                      completed: payload.completed,
                                  })
                              )
                            : project
                    )
                );
            }
            closeEditor();
            return;
        }

        // EDIT mode
        if (!selectedTodoRef) return;
        const { id: selectedId, projectName: selectedProjectName } = selectedTodoRef;
        const originalProject = projects.find(project => project.name === selectedProjectName);
        const targetProject = projects.find(project => project.id === payload.projectId);
        if (!originalProject || !targetProject) return;

        const isMoving = originalProject.id !== targetProject.id;

        setProjects(previousProjects => {
            let updatedProjects = previousProjects;

            if (isMoving) {
                // remove from old project
                updatedProjects = updatedProjects.map(project =>
                    project.id === originalProject.id ? project.removeTodo(selectedId) : project
                );
                // add to new project with updated project name
                const foundTodo = originalProject.todos.find(todo => todo.id === selectedId);
                if (foundTodo) {
                    const updatedTodo = foundTodo.update(payload);
                    const movedTodo = new Todo(
                        updatedTodo.id,
                        updatedTodo.title,
                        targetProject.name,
                        updatedTodo.description,
                        updatedTodo.dueDate,
                        updatedTodo.priority,
                        updatedTodo.completed
                    );
                    updatedProjects = updatedProjects.map(project =>
                        project.id === targetProject.id ? project.add(movedTodo) : project
                    );
                }
            } else {
                updatedProjects = updatedProjects.map(project =>
                    project.id === originalProject.id
                        ? project.mapTodo(selectedId, todo => todo.update(payload))
                        : project
                );
            }
            return updatedProjects;
        });

        closeEditor();
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto' />
            <View style={styles.header}>
                <Text style={styles.title}>ToDo or Not</Text>
            </View>

            <TabBar active={activeTab} onChange={setActiveTab} />

            <View style={styles.content}>
                {activeTab === 'Home' && (
                    <HomeScreen
                        todos={allTodos}
                        onAdd={title => {
                            if (projects.length === 0) return;
                            setEditorMode('create');
                            setDraftTitle(title);
                            setDraftProjectId(projects[0].id);
                            setEditorVisible(true);
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
                    <ProjectsScreen
                        projects={projects}
                        onSelect={() => setActiveTab('Home')} // TODO: switch to ProjectDetailScreen
                    />
                )}
            </View>

            <EditTodoModal
                visible={editorVisible}
                mode={editorMode}
                todo={selectedTodo}
                initialTitle={draftTitle}
                initialProjectId={draftProjectId ?? undefined}
                projects={projectChoices}
                onClose={closeEditor}
                onSave={saveEdits}
                onDelete={
                    selectedTodoRef
                        ? () => {
                              confirmDelete(selectedTodoRef.id, selectedTodoRef.projectName);
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
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingTop: 30,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        alignSelf: 'stretch',
    },
});
