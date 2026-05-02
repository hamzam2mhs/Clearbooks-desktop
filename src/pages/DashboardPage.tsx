import { useEffect, useState } from 'react';
import {
    getCurrentBackendUser,
    getIncomeSummary,
    getProfitSummary,
    getTaxSummary,
} from '../lib/api';
import type {
    BackendUser,
    IncomeSummary,
    ProfitSummary,
    TaxSummary,
} from '../lib/api';
import { formatCents } from '../lib/formatMoney';

type DashboardState = {
    user: BackendUser;
    income: IncomeSummary;
    tax: TaxSummary;
    profit: ProfitSummary;
};

function DashboardPage() {
    const [data, setData] = useState<DashboardState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadDashboard() {
        try {
            setLoading(true);
            setError('');

            const [user, income, tax, profit] = await Promise.all([
                getCurrentBackendUser(),
                getIncomeSummary(),
                getTaxSummary(),
                getProfitSummary(),
            ]);

            setData({ user, income, tax, profit });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return (
            <section className="panel">
                <h2>Dashboard error</h2>
                <p className="error-text">{error}</p>
                <button onClick={loadDashboard}>Try again</button>
            </section>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h2>Dashboard</h2>
                </div>

                <button onClick={loadDashboard}>Refresh</button>
            </div>

            <div className="cards-grid">
                <article className="metric-card">
                    <span>Total Income</span>
                    <strong>{formatCents(data.income.totalIncomeCents)}</strong>
                    <small>
                        Tax collected: {formatCents(data.income.totalTaxCollectedCents)}
                    </small>
                </article>

                <article className="metric-card">
                    <span>Total Expenses</span>
                    <strong>{formatCents(data.profit.totalExpenseCents)}</strong>
                    <small>Used for profit calculation</small>
                </article>

                <article className="metric-card">
                    <span>Net Profit</span>
                    <strong>{formatCents(data.profit.netProfitCents)}</strong>
                    <small>Income minus expenses</small>
                </article>

                <article className="metric-card">
                    <span>Net Tax Payable</span>
                    <strong>{formatCents(data.tax.netTaxPayableCents)}</strong>
                    <small>
                        Collected {formatCents(data.tax.taxCollectedCents)} · Paid{' '}
                        {formatCents(data.tax.taxPaidCents)}
                    </small>
                </article>
            </div>

            <div className="panel">
                <h3>Authenticated business context</h3>
                <p>
                    This proves the frontend is using the Cognito access token and the backend is
                    resolving the internal user and business context.
                </p>

                <dl className="details-list">
                    <div>
                        <dt>User ID</dt>
                        <dd>{data.user.userId}</dd>
                    </div>

                    <div>
                        <dt>Business ID</dt>
                        <dd>{data.user.businessId}</dd>
                    </div>

                    <div>
                        <dt>Cognito Sub</dt>
                        <dd>{data.user.cognitoSub}</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}

export default DashboardPage;