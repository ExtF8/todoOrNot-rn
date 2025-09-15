import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, FlatList, StyleSheet } from 'react-native';
import { Todo } from '../../entities/Todo';
import TodoRow from '../components/TodoRow';

export default function HomeScreen({
    todos,
    onAdd,
    onToggle,
    onDelete,
    onEdit,
}: {
    todos: Todo[];
    onAdd: (title: string) => void;
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
    onEdit?: (todo: Todo) => void;
}) {
    const [text, setText] = useState('');

    function addTodo() {
        const title = text.trim();
        if (title.length === 0) {
            return;
        }
        onAdd(title);
        setText('');
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder='Add todo or not...'
                />
                <Pressable style={styles.addButton} onPress={addTodo}>
                    <Text style={styles.addText}>Add</Text>
                </Pressable>
            </View>

            <FlatList
                data={todos}
                keyExtractor={todo => String(todo.id)}
                renderItem={({ item }) => (
                    <TodoRow todo={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                )}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
                contentContainerStyle={todos.length === 0 ? styles.center : undefined}
                ListEmptyComponent={<Text style={{ color: '#666' }}>Nothing to see here...</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 8,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        width: '50%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
    addButton: {
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    addText: {
        fontWeight: '700',
    },
    center: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    seperator: {
        height: 1,
        backgroundColor: '#eee',
        marginLeft: 16,
    },
});
