import { API_BASE_URL } from '../config/env';

export async function getHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
        throw new Error('Failed to connect to backend');
    }

    return response.json();
}

export async function getDbHealth() {
    const response = await fetch(`${API_BASE_URL}/health/db`);

    if (!response.ok) {
        throw new Error('Failed to connect to database health endpoint');
    }

    return response.json();
}