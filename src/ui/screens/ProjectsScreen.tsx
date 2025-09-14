import React from 'react';
import { View, FlatList, Text, Pressable, StyleSheet } from 'react-native';
import { Project } from '../../entities/Project';

export default function ProjectsScreen({
    projects,
    onSelect,
}: {
    projects: Project[];

    onSelect: (projectName: string) => void;
}) {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={projects}
                keyExtractor={p => String(p.id)}
                renderItem={({ item }) => (
                    <Pressable onPress={() => onSelect(item.name)} style={styles.row}>
                        <Text style={styles.name}>{item.name}</Text>
                    </Pressable>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#eee', marginLeft: 16 }} />
                )}
                contentContainerStyle={
                    projects.length === 0
                        ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }
                        : undefined
                }
                ListEmptyComponent={<Text style={{ color: '#666' }}>No projects yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
});
