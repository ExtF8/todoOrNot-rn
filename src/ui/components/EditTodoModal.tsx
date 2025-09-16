import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';
import { Todo, Priority } from '../../entities/Todo';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Props = {
    visible: boolean;
    mode: 'create' | 'edit';
    // create new
    initialTitle?: string;
    initialProjectId?: number;
    // picking projects
    projects: { id: number; name: string }[];
    // editing
    todo: Todo | null;
    onClose: () => void;
    onSave: (payload: {
        projectId: number;
        title: string;
        description: string;
        dueDate: string | null;
        priority: Priority;
        completed: boolean;
    }) => void;
    onDelete?: () => void;
};

export default function EditTodoModal({
    visible,
    mode,
    initialTitle,
    initialProjectId,
    projects,
    todo,
    onClose,
    onSave,
    onDelete,
}: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [priority, setPriority] = useState<Priority>('medium');
    const [completed, setCompleted] = useState(false);
    const [projectId, setProjectId] = useState<number | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        if (!visible) return;

        if (mode === 'edit' && todo) {
            setTitle(todo.title);
            setDescription(todo.description);
            setDueDate(todo.dueDate);
            setPriority(todo.priority);
            setCompleted(todo.completed);
            // find project by name
            const p = projects.find(p => p.name === todo.project);
            setProjectId(p ? p.id : projects[0]?.id ?? null);
        } else {
            setTitle(initialTitle ?? '');
            setDescription('');
            setDueDate(null);
            setPriority('medium');
            setCompleted(false);
            setProjectId(initialProjectId ?? projects[0]?.id ?? null);
        }
    }, [visible, mode, todo, initialTitle, initialProjectId, projects]);

    function handleSave() {
        const cleanTitle = title.trim();
        if (cleanTitle.length === 0) return;
        if (projectId == null) return;

        onSave({
            projectId,
            title: cleanTitle,
            description: description.trim(),
            dueDate: dueDate && dueDate.trim().length > 0 ? dueDate.trim() : null,
            priority,
            completed,
        });
    }

    // Priority colors
    const PRIORITY_COLORS = {
        low: '#22C55E',
        medium: '#EAB308',
        high: '#DC2626',
    } as const;

    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={{ flex: 1, }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={-100}
            >
                <View style={styles.backdrop}>
                    <View style={styles.card}>
                        <Text style={styles.header}>Edit Todo</Text>

                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder='Task title'
                            style={styles.input}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder='Todo what?'
                            multiline
                            style={[styles.input, styles.multiline]}
                        />

                        <Text style={styles.label}>Due date</Text>
                        <View style={styles.row}>
                            <TextInput
                                value={dueDate ?? ''}
                                onChangeText={txt => setDueDate(txt)}
                                placeholder='YYYY-MM-DD'
                                style={[styles.input, { flex: 1 }]}
                                autoCapitalize='none'
                                autoCorrect={false}
                            />
                            <Pressable onPress={() => setPickerOpen(true)} style={styles.clearBtn}>
                                <Text style={styles.clearBtnText}>Pick</Text>
                            </Pressable>
                            <Pressable onPress={() => setDueDate(null)} style={styles.clearBtn}>
                                <Text style={styles.clearBtnText}>Clear</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.priorityRow}>
                            {(['low', 'medium', 'high'] as Priority[]).map(p => (
                                <Pressable
                                    key={p}
                                    onPress={() => setPriority(p)}
                                    style={[
                                        styles.pill,
                                        priority === p && {
                                            backgroundColor: PRIORITY_COLORS[p],
                                            borderColor: PRIORITY_COLORS[p],
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.pillText,
                                            priority === p && { color: '#fff' },
                                        ]}
                                    >
                                        {p}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* date picker */}
                        {pickerOpen && (
                            <DateTimePicker
                                value={dueDate ? new Date(dueDate) : new Date()}
                                mode='date'
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event: DateTimePickerEvent, date?: Date) => {
                                    setPickerOpen(false);
                                    if (event.type === 'set' && date) {
                                        // store as YYYY-MM-DD
                                        const yyyyMmDd = date.toISOString().split('T')[0];
                                        setDueDate(yyyyMmDd);
                                    }
                                }}
                            />
                        )}

                        <Text style={styles.label}>Status</Text>
                        <View style={styles.priorityRow}>
                            <Pressable
                                onPress={() => setCompleted(false)}
                                style={[styles.pill, !completed && styles.pillActive]}
                            >
                                <Text
                                    style={[styles.pillText, !completed && styles.pillTextActive]}
                                >
                                    Open
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setCompleted(true)}
                                style={[styles.pill, completed && styles.pillActive]}
                            >
                                <Text style={[styles.pillText, completed && styles.pillTextActive]}>
                                    Done
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.actionsRow}>
                            {onDelete && (
                                <Pressable
                                    onPress={onDelete}
                                    style={[styles.actionBtn, styles.delete]}
                                >
                                    <Text style={styles.actionTextDelete}>Delete</Text>
                                </Pressable>
                            )}
                            <View style={{ flex: 1 }} />
                            <Pressable onPress={onClose} style={[styles.actionBtn, styles.cancel]}>
                                <Text style={styles.actionText}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleSave} style={[styles.actionBtn, styles.save]}>
                                <Text style={styles.actionTextSave}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        color: '#374151',
        fontSize: 13,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: Platform.select({ ios: 10, android: 8 }),
        fontSize: 16,
    },
    multiline: {
        minHeight: 72,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    clearBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    clearBtnText: {
        color: '#374151',
        fontWeight: '600',
    },

    priorityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    pill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    pillActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    pillText: {
        color: '#111827',
        fontWeight: '600',
    },
    pillTextActive: {
        color: '#fff',
    },

    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
    },
    actionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    cancel: {
        borderColor: '#D1D5DB',
        backgroundColor: '#fff',
    },
    save: {
        borderColor: '#111827',
        backgroundColor: '#111827',
    },
    delete: {
        borderColor: '#DC2626',
        backgroundColor: '#fff',
    },
    actionText: {
        color: '#111827',
        fontWeight: '700',
    },
    actionTextSave: {
        color: '#fff',
        fontWeight: '700',
    },
    actionTextDelete: {
        color: '#DC2626',
        fontWeight: '700',
    },
});
