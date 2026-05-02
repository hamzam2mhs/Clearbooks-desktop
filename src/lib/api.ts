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

export type Transaction = {
    id: string;
    businessId: string;
    type: 'INCOME' | 'EXPENSE';
    amountCents: string;
    taxCents: string;
    category: string;
    occurredAt: string;
    createdAt: string;
};

export type CreateTransactionPayload = {
    amountCents: number;
    taxCents: number;
    category: string;
    occurredAt: string;
};

export type OpeningSnapshot = {
    id: string;
    businessId: string;
    effectiveDate: string;
    cashCents: string;
    receivablesCents: string;
    payablesCents: string;
    taxPayableCents: string;
    declaredByUser: boolean;
    locked: boolean;
    createdAt: string;
};

export type CreateOpeningSnapshotPayload = {
    effectiveDate: string;
    cashCents: number;
    receivablesCents: number;
    payablesCents: number;
    taxPayableCents: number;
};

async function getAccessToken() {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
        throw new Error('No access token found');
    }

    return accessToken;
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            `API request failed: ${response.status}`;

        throw new Error(message);
    }

    return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
    return apiRequest<T>(path);
}

export async function apiPost<T, TBody>(path: string, body: TBody): Promise<T> {
    return apiRequest<T>(path, {
        method: 'POST',
        body: JSON.stringify(body),
    });
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

export function getTransactions() {
    return apiGet<Transaction[]>('/api/transactions');
}

export function createIncomeTransaction(payload: CreateTransactionPayload) {
    return apiPost<Transaction, CreateTransactionPayload>(
        '/api/transactions/income',
        payload
    );
}

export function createExpenseTransaction(payload: CreateTransactionPayload) {
    return apiPost<Transaction, CreateTransactionPayload>(
        '/api/transactions/expense',
        payload
    );
}

export function getOpeningSnapshot() {
    return apiGet<OpeningSnapshot | null>('/api/opening-snapshot');
}

export function createOpeningSnapshot(payload: CreateOpeningSnapshotPayload) {
    return apiPost<OpeningSnapshot, CreateOpeningSnapshotPayload>(
        '/api/opening-snapshot',
        payload
    );
}