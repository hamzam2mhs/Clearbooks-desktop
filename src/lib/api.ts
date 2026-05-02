import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../config/env';

export type BackendUser = {
    cognitoSub: string;
    email?: string;
    userId: string;
    businessId: string;
};

export type IncomeSummary = {
    totalIncomeCents: string;
    totalTaxCollectedCents: string;
};

export type TaxSummary = {
    taxCollectedCents: string;
    taxPaidCents: string;
    netTaxPayableCents: string;
};

export type ProfitSummary = {
    totalIncomeCents: string;
    totalExpenseCents: string;
    netProfitCents: string;
};

async function getAccessToken() {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
        throw new Error('No access token found');
    }

    return accessToken;
}

export async function apiGet<T>(path: string): Promise<T> {
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

export function getCurrentBackendUser() {
    return apiGet<BackendUser>('/api/me');
}

export function getIncomeSummary() {
    return apiGet<IncomeSummary>('/api/summary/income');
}

export function getTaxSummary() {
    return apiGet<TaxSummary>('/api/summary/tax');
}

export function getProfitSummary() {
    return apiGet<ProfitSummary>('/api/summary/profit');
}