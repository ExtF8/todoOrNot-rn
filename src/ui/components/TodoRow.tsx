import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Todo } from '../../entities/Todo';

const PRIORITY_COLORS = {
    low: '#22C55E',
    medium: '#EAB308',
    high: '#DC2626',
} as const;

export default function TodoRow({
    todo,
    onToggle,
    onDelete,
    onEdit,
}: {
    todo: Todo;
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
    onEdit?: (todo: Todo) => void;
}) {
    const handleToggle = () => onToggle(todo.id, todo.project);
    const handleDelete = () => onDelete(todo.id, todo.project);
    const handleEdit = () => onEdit && onEdit(todo);

    return (
        <View style={styles.row}>
            <Pressable
                onPress={handleToggle}
                style={({ pressed }) => [
                    styles.checkbox,
                    todo.completed && styles.on,
                    pressed && styles.pressed,
                ]}
                accessibilityRole='checkbox'
                accessibilityState={{ checked: todo.completed }}
                hitSlop={8}
            />

            <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[todo.priority] }]} />

            <View style={styles.textWrap}>
                <Text style={[styles.title, todo.completed && styles.done]} numberOfLines={2}>
                    {todo.title}
                </Text>
                {!!todo.project && <Text style={styles.projectName}>{todo.project}</Text>}
            </View>

            <Pressable
                onPress={handleEdit}
                style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole='button'
                accessibilityLabel='Edit task'
            >
                <Text style={styles.editText}>Edit</Text>
            </Pressable>
            <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole='button'
                accessibilityLabel='Delete task'
            >
                <Text style={styles.deleteText}>✕</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        minHeight: 56,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        backgroundColor: 'transparent',
    },
    on: {
        backgroundColor: '#22C55E',
        borderColor: '#22C55E',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    textWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        color: '#111827',
    },
    done: {
        color: '#777',
        textDecorationLine: 'line-through',
    },
    projectName: {
        marginTop: 2,
        fontSize: 12,
        color: '#9CA3AF',
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    editText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
    deleteBtn: {
        padding: 6,
        marginLeft: 6,
        borderRadius: 8,
    },
    deleteText: {
        fontSize: 18,
        color: '#DC2626',
    },
    pressed: {
        opacity: 0.5,
    },
});
