import { useEffect, useMemo, useState } from 'react';
import {
    getReportingPeriods,
    lockReportingPeriod,
} from '../lib/api';
import type { ReportingPeriod } from '../lib/api';

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-CA');
}

function ReportingPeriodsPage() {
    const [periods, setPeriods] = useState<ReportingPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [lockingId, setLockingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sortedPeriods = useMemo(() => {
        return [...periods].sort((a, b) => {
            return (
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            );
        });
    }, [periods]);

    async function loadPeriods() {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const data = await getReportingPeriods();
            setPeriods(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reporting periods');
        } finally {
            setLoading(false);
        }
    }

    async function handleLockPeriod(period: ReportingPeriod) {
        if (period.locked) {
            return;
        }

        const confirmed = window.confirm(
            `Lock reporting period ${formatDate(period.startDate)} to ${formatDate(
                period.endDate
            )}? Once locked, new transactions for this period will be rejected.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLockingId(period.id);
            setError('');
            setSuccess('');

            const updated = await lockReportingPeriod(period.id);

            setPeriods((current) =>
                current.map((item) => (item.id === updated.id ? updated : item))
            );

            setSuccess('Reporting period locked successfully.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to lock reporting period');
        } finally {
            setLockingId(null);
        }
    }

    useEffect(() => {
        loadPeriods();
    }, []);

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Audit-safe history</p>
                    <h2>Reporting Periods</h2>
                </div>

                <button onClick={loadPeriods} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
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

            <section className="panel">
                <h3>Monthly periods</h3>
                <p>
                    Reporting periods are created automatically when transactions are added.
                    Locking a period prevents new transactions from being added to that period.
                </p>

                {loading ? (
                    <p>Loading reporting periods...</p>
                ) : sortedPeriods.length === 0 ? (
                    <p>No reporting periods yet. Add a transaction to create one.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {sortedPeriods.map((period) => (
                                <tr key={period.id}>
                                    <td>{formatDate(period.startDate)}</td>
                                    <td>{formatDate(period.endDate)}</td>
                                    <td>{period.type}</td>
                                    <td>
                                            <span
                                                className={
                                                    period.locked
                                                        ? 'badge badge-locked'
                                                        : 'badge badge-unlocked'
                                                }
                                            >
                                                {period.locked ? 'Locked' : 'Unlocked'}
                                            </span>
                                    </td>
                                    <td>{formatDate(period.createdAt)}</td>
                                    <td>
                                        <button
                                            className="secondary-button"
                                            disabled={period.locked || lockingId === period.id}
                                            onClick={() => handleLockPeriod(period)}
                                        >
                                            {lockingId === period.id
                                                ? 'Locking...'
                                                : period.locked
                                                    ? 'Locked'
                                                    : 'Lock period'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </section>
    );
}

export default ReportingPeriodsPage;