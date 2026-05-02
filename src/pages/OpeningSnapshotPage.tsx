import { useEffect, useState } from 'react';
import {
    createOpeningSnapshot,
    getOpeningSnapshot,
} from '../lib/api';
import type { OpeningSnapshot } from '../lib/api';
import { formatCents } from '../lib/formatMoney';

type FormState = {
    effectiveDate: string;
    cash: string;
    receivables: string;
    payables: string;
    taxPayable: string;
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
    return new Date(`${date}T00:00:00.000`).toISOString();
}

function OpeningSnapshotPage() {
    const [snapshot, setSnapshot] = useState<OpeningSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState<FormState>({
        effectiveDate: getTodayInputValue(),
        cash: '',
        receivables: '0',
        payables: '0',
        taxPayable: '0',
    });

    async function loadSnapshot() {
        try {
            setLoading(true);
            setError('');

            const data = await getOpeningSnapshot();
            setSnapshot(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load opening snapshot');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSnapshot();
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

        const cashCents = dollarsToCents(form.cash);
        const receivablesCents = dollarsToCents(form.receivables || '0');
        const payablesCents = dollarsToCents(form.payables || '0');
        const taxPayableCents = dollarsToCents(form.taxPayable || '0');

        if (cashCents == null || cashCents < 0) {
            setError('Enter a valid cash amount.');
            return;
        }

        if (receivablesCents == null || receivablesCents < 0) {
            setError('Enter a valid receivables amount.');
            return;
        }

        if (payablesCents == null || payablesCents < 0) {
            setError('Enter a valid payables amount.');
            return;
        }

        if (taxPayableCents == null || taxPayableCents < 0) {
            setError('Enter a valid tax payable amount.');
            return;
        }

        try {
            setSubmitting(true);

            const created = await createOpeningSnapshot({
                effectiveDate: dateInputToIso(form.effectiveDate),
                cashCents,
                receivablesCents,
                payablesCents,
                taxPayableCents,
            });

            setSnapshot(created);
            setSuccess('Opening snapshot created successfully.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create opening snapshot');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <p>Loading opening snapshot...</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Starting baseline</p>
                    <h2>Opening Snapshot</h2>
                </div>

                <button onClick={loadSnapshot}>Refresh</button>
            </div>

            {error && (
                <section className="panel">
                    <p className="error-text">{error}</p>
                </section>
            )}

            {success && (
                <section className="panel">
                    <p className="success-text">{success}</p>
                </section>
            )}

            {snapshot ? (
                <section className="panel">
                    <h3>Current opening snapshot</h3>
                    <p>
                        This snapshot is the starting financial baseline for the business.
                        Transactions before this date should be blocked by the backend.
                    </p>

                    <dl className="snapshot-grid">
                        <div>
                            <dt>Effective Date</dt>
                            <dd>{new Date(snapshot.effectiveDate).toLocaleDateString('en-CA')}</dd>
                        </div>

                        <div>
                            <dt>Cash</dt>
                            <dd>{formatCents(snapshot.cashCents)}</dd>
                        </div>

                        <div>
                            <dt>Receivables</dt>
                            <dd>{formatCents(snapshot.receivablesCents)}</dd>
                        </div>

                        <div>
                            <dt>Payables</dt>
                            <dd>{formatCents(snapshot.payablesCents)}</dd>
                        </div>

                        <div>
                            <dt>Tax Payable</dt>
                            <dd>{formatCents(snapshot.taxPayableCents)}</dd>
                        </div>

                        <div>
                            <dt>Status</dt>
                            <dd>{snapshot.locked ? 'Locked' : 'Unlocked'}</dd>
                        </div>
                    </dl>
                </section>
            ) : (
                <section className="panel">
                    <h3>Create opening snapshot</h3>
                    <p>
                        Create the starting financial baseline for this business. Only one opening
                        snapshot is allowed for V1.
                    </p>

                    <form className="form-grid" onSubmit={handleSubmit}>
                        <label>
                            Effective Date
                            <input
                                type="date"
                                value={form.effectiveDate}
                                onChange={(event) =>
                                    updateForm('effectiveDate', event.target.value)
                                }
                            />
                        </label>

                        <label>
                            Cash
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="3500.00"
                                value={form.cash}
                                onChange={(event) => updateForm('cash', event.target.value)}
                            />
                        </label>

                        <label>
                            Receivables
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.receivables}
                                onChange={(event) =>
                                    updateForm('receivables', event.target.value)
                                }
                            />
                        </label>

                        <label>
                            Payables
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.payables}
                                onChange={(event) => updateForm('payables', event.target.value)}
                            />
                        </label>

                        <label>
                            Tax Payable
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.taxPayable}
                                onChange={(event) =>
                                    updateForm('taxPayable', event.target.value)
                                }
                            />
                        </label>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create opening snapshot'}
                        </button>
                    </form>
                </section>
            )}
        </section>
    );
}

export default OpeningSnapshotPage;