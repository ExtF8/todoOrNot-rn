import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { Todo } from '../../entities/Todo';
import TodoRow from '../components/TodoRow';

export default function WeekScreen({
    todos,
    onToggle,
    onDelete,
}: {
    todos: Todo[];
    onToggle: (id: number, projectName: string) => void;
    onDelete: (id: number, projectName: string) => void;
}) {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={todos}
                keyExtractor={t => String(t.id)}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#eee', marginLeft: 16 }} />
                )}
                renderItem={({ item }) => (
                    <TodoRow todo={item} onToggle={onToggle} onDelete={onDelete} />
                )}
                contentContainerStyle={
                    todos.length === 0
                        ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }
                        : undefined
                }
                ListEmptyComponent={<Text style={{ color: '#666' }}>Nothing due this week.</Text>}
            />
        </View>
    );
}
