import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Project } from '../../entities/Project';
import { Todo } from '../../entities/Todo';
import TodoRow from '../components/TodoRow';

export default function ProjectsScreen({
    projects,
    onToggle,
    onDelete,
    onEdit,
}: {
    projects: Project[];
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
    onEdit?: (todo: Todo) => void;
}) {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const selectedProject = useMemo(
        () => projects.find(project => project.id === selectedProjectId) ?? null,
        [projects, selectedProjectId]
    );

    if (selectedProject) {
        // Detail view: todos in the selected project
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                    <Pressable
                        onPress={() => setSelectedProjectId(null)}
                        style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
                    >
                        <Text style={styles.navBtnText}>Back</Text>
                    </Pressable>
                    <Text style={styles.headerTitle}>{selectedProject.name}</Text>
                    <View style={{ width: 64 }} />
                </View>

                <FlatList
                    data={selectedProject.todos}
                    keyExtractor={todo => String(todo.id)}
                    renderItem={({ item }) => (
                        <TodoRow
                            todo={item}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={
                        selectedProject.todos.length === 0 ? styles.center : { paddingBottom: 16 }
                    }
                    ListEmptyComponent={<Text style={{ color: '#666' }}>No todos yet…</Text>}
                    style={{ alignSelf: 'stretch' }}
                />
            </View>
        );
    }

    // Project list
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={projects}
                keyExtractor={project => String(project.id)}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => setSelectedProjectId(item.id)}
                        style={({ pressed }) => [styles.projectRow, pressed && styles.pressed]}
                    >
                        <Text style={styles.projectName}>{item.name}</Text>
                        <Text style={styles.count}>{item.todos.length}</Text>
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={
                    projects.length === 0 ? styles.center : { paddingBottom: 16 }
                }
                ListEmptyComponent={<Text style={{ color: '#666' }}>No projects…</Text>}
                style={{ alignSelf: 'stretch' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    navBtn: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    navBtnText: {
        fontWeight: '700',
        color: '#111827',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    projectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    projectName: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },
    count: {
        fontSize: 14,
        color: '#6B7280',
    },
    center: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E7EB',
        marginLeft: 16,
    },
    pressed: {
        opacity: 0.5,
    },
});
