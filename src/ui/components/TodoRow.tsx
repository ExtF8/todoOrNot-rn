import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Todo } from '../../entities/Todo';

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
        <View style={styles.rowContainer}>
            <View style={styles.row}>
                <Pressable
                    onPress={handleToggle}
                    style={[styles.checkbox, todo.compleded && styles.on]}
                    accessibilityRole='checkbox'
                    accessibilityState={{ checked: todo.compleded }}
                ></Pressable>
                <View>
                    <Text style={[styles.title, todo.compleded && styles.done]} numberOfLines={2}>
                        {todo.title}
                    </Text>
                </View>
            </View>
            <View style={styles.editContainer}>
                <Pressable
                    onPress={handleEdit}
                    style={styles.editButton}
                    hitSlop={8}
                    accessibilityRole='button'
                    accessibilityLabel='Edit task'
                >
                    <Text style={styles.editText}>Edit</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={styles.delete}>
                    <Text style={styles.deleteText}>x</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    row: {
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        flexDirection: 'row',
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
        justifyContent: 'flex-start',
    },
    done: {
        color: '#777',
        textDecorationLine: 'line-through',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    editText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
    delete: {
        padding: 6,
        marginLeft: 8,
        justifyContent: 'flex-end',
    },
    deleteText: {
        color: '#c62828',
        fontSize: 16,
    },
});
