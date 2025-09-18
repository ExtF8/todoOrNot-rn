import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export type Tab = 'Home' | 'Today' | 'Week' | 'Projects';

export default function TabBar({
    active,
    onChange,
}: {
    active: Tab;
    onChange: (tab: Tab) => void;
}) {
    const tabs: Tab[] = ['Home', 'Today', 'Week', 'Projects'];

    return (
        <View style={styles.row}>
            {tabs.map(tab => (
                <Pressable
                    key={tab}
                    onPress={() => onChange(tab)}
                    style={({ pressed }) => [
                        styles.tab,
                        active === tab && styles.active,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={[styles.text, active === tab && styles.textActive]}>{tab}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 8,
        gap: 8,
        justifyContent: 'space-around',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    active: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    text: {
        color: '#23a9f2',
        fontWeight: '600',
    },
    textActive: {
        color: '#fff',
    },
    pressed: {
        opacity: 0.5,
    },
});
