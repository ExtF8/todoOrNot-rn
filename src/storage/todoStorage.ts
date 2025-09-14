import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from './storageKeys';
import { Project } from '../entities/Project';

export async function loadProjects(): Promise<Project[]> {
    try {
        const raw = await AsyncStorage.getItem(storageKeys.PROJECTS_V1);

        if (!raw) {
            return [];
        }

        const parsedProjects = JSON.parse(raw);

        if (!Array.isArray(parsedProjects)) {
            return [];
        }
        return parsedProjects.map(Project.fromJSON); // Rehydrate to classes
    } catch (error) {
        console.error('Loading todos failed: ', error);
        return [];
    }
}

export async function saveProjects(projects: Project[]): Promise<void> {
    try {
        const serialize = projects.map(project => project.toJSON());
        await AsyncStorage.setItem(storageKeys.PROJECTS_V1, JSON.stringify(serialize));
    } catch (error) {
        console.error('saveProjects failed', error);
    }
}
