import { useEffect, useMemo, useState } from 'react';
import {
    createExpenseTransaction,
    createIncomeTransaction,
    getTransactions,
} from '../lib/api';
import type { Transaction } from '../lib/api';
import { formatCents } from '../lib/formatMoney';

type TransactionType = 'INCOME' | 'EXPENSE';

type FormState = {
    type: TransactionType;
    amount: string;
    tax: string;
    category: string;
    occurredAt: string;
};

function getTodayInputValue() {
    return new Date().toISOString().slice(0, 10);
}

function dollarsToCents(value: string) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return null;
    }

    return Math.round(numericValue * 100);
}

function dateInputToIso(date: string) {
    return new Date(`${date}T12:00:00.000`).toISOString();
}

function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState<FormState>({
        type: 'INCOME',
        amount: '',
        tax: '0',
        category: '',
        occurredAt: getTodayInputValue(),
    });

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            return (
                new Date(b.occurredAt).getTime() -
                new Date(a.occurredAt).getTime()
            );
        });
    }, [transactions]);

    async function loadTransactions() {
        try {
            setLoading(true);
            setError('');

            const data = await getTransactions();
            setTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    function updateForm(field: keyof FormState, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setSuccess('');

        const amountCents = dollarsToCents(form.amount);
        const taxCents = dollarsToCents(form.tax || '0');

        if (amountCents == null || amountCents < 0) {
            setError('Enter a valid amount.');
            return;
        }

        if (taxCents == null || taxCents < 0) {
            setError('Enter a valid tax amount.');
            return;
        }

        if (!form.category.trim()) {
            setError('Enter a category.');
            return;
        }

        if (!form.occurredAt) {
            setError('Select a transaction date.');
            return;
        }

        const payload = {
            amountCents,
            taxCents,
            category: form.category.trim(),
            occurredAt: dateInputToIso(form.occurredAt),
        };

        try {
            setSubmitting(true);

            if (form.type === 'INCOME') {
                await createIncomeTransaction(payload);
            } else {
                await createExpenseTransaction(payload);
            }

            setSuccess('Transaction added successfully.');
            setForm({
                type: form.type,
                amount: '',
                tax: '0',
                category: '',
                occurredAt: getTodayInputValue(),
            });

            await loadTransactions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create transaction');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Money movement</p>
                    <h2>Transactions</h2>
                </div>

                <button onClick={loadTransactions} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="two-column-grid">
                <section className="panel">
                    <h3>Add transaction</h3>
                    <p>
                        Add income or expense records. The backend will reject entries for locked
                        reporting periods.
                    </p>

                    <form className="form-grid" onSubmit={handleSubmit}>
                        <label>
                            Type
                            <select
                                value={form.type}
                                onChange={(event) =>
                                    updateForm('type', event.target.value as TransactionType)
                                }
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </label>

                        <label>
                            Amount
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="100.00"
                                value={form.amount}
                                onChange={(event) => updateForm('amount', event.target.value)}
                            />
                        </label>

                        <label>
                            Tax
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="5.00"
                                value={form.tax}
                                onChange={(event) => updateForm('tax', event.target.value)}
                            />
                        </label>

                        <label>
                            Category
                            <input
                                type="text"
                                placeholder="Sales, Supplies, Fuel..."
                                value={form.category}
                                onChange={(event) => updateForm('category', event.target.value)}
                            />
                        </label>

                        <label>
                            Date
                            <input
                                type="date"
                                value={form.occurredAt}
                                onChange={(event) => updateForm('occurredAt', event.target.value)}
                            />
                        </label>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add transaction'}
                        </button>
                    </form>
                </section>

                <section className="panel">
                    <h3>Transaction history</h3>

                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : sortedTransactions.length === 0 ? (
                        <p>No transactions yet.</p>
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Tax</th>
                                </tr>
                                </thead>

                                <tbody>
                                {sortedTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>
                                            {new Date(
                                                transaction.occurredAt
                                            ).toLocaleDateString('en-CA')}
                                        </td>
                                        <td>
                                                <span
                                                    className={
                                                        transaction.type === 'INCOME'
                                                            ? 'badge badge-income'
                                                            : 'badge badge-expense'
                                                    }
                                                >
                                                    {transaction.type}
                                                </span>
                                        </td>
                                        <td>{transaction.category}</td>
                                        <td>{formatCents(transaction.amountCents)}</td>
                                        <td>{formatCents(transaction.taxCents)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}

export default TransactionsPage;