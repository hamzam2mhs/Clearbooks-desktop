import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../config/env';

async function getAccessToken() {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
        throw new Error('No access token found');
    }

    return accessToken;
}

export async function apiGet(path: string) {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}

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

export async function getCurrentBackendUser() {
    return apiGet('/api/me');
}