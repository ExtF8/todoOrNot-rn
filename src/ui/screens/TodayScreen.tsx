import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { Todo } from '../../entities/Todo';
import TodoRow from '../components/TodoRow';

export default function TodayScreen({
    todos,
    onToggle,
    onDelete,
}: {
    todos: Todo[];
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
}) {
    return (
        <View>
            <FlatList
                data={todos}
                keyExtractor={todo => String(todo.id)}
                renderItem={({ item }) => (
                    <TodoRow todo={item} onToggle={onToggle} onDelete={onDelete} />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#eee', marginLeft: 16 }} />
                )}
                contentContainerStyle={
                    todos.length === 0
                        ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }
                        : undefined
                }
                ListEmptyComponent={<Text style={{ color: '#666' }}>No tasks due today.</Text>}
            />
        </View>
    );
}
