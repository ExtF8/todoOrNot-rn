import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Todo } from '../../entities/Todo';

export default function TodoRow({
    todo,
    onToggle,
    onDelete,
}: {
    todo: Todo;
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
}) {
    return (
        <View style={styles.row}>
            <Pressable
                onPress={() => onToggle(todo.id, todo.project)}
                style={[styles.checkbox, todo.compleded && styles.on]}
                accessibilityRole='checkbox'
                accessibilityState={{ checked: todo.compleded }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, todo.compleded && styles.done]} numberOfLines={2}>
                        {todo.title}
                    </Text>
                    {!!todo.project && <Text style={styles.project}>{todo.project}</Text>}
                </View>
                <Pressable onPress={() => onDelete(todo.id, todo.project)} style={styles.delete}>
                    <Text style={styles.deleteText}>x</Text>
                </Pressable>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#888',
    },
    on: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    title: {
        fontSize: 16,
    },
    done: {
        color: '#777',
        textDecorationLine: 'line-through',
    },
    project: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    delete: {
        padding: 6,
        marginLeft: 8,
    },
    deleteText: {
        color: '#c62828',
        fontSize: 16,
    },
});
