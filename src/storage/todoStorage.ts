import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from './storageKeys';
import { ToDo } from '../types/types';

export async function loadTodos(): Promise<ToDo[]> {
    try {
        const todos = await AsyncStorage.getItem(storageKeys.TODOS_V1);

        if (!todos) {
            return [];
        }

        const parsedTodos = JSON.parse(todos);

        return Array.isArray(parsedTodos) ? (parsedTodos as ToDo[]) : [];
    } catch (error) {
        console.error('Loading todos failed: ', error);
        return [];
    }
}
