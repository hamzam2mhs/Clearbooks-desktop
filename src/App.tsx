import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OpeningSnapshotPage from './pages/OpeningSnapshotPage';
import ReportingPeriodsPage from './pages/ReportingPeriodsPage';
import TransactionsPage from './pages/TransactionsPage';
import './App.css';

function App() {
    return (
        <Authenticator loginMechanisms={['email']}>
            {({ signOut, user }) => (
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <AppLayout
                                    loginId={user?.signInDetails?.loginId}
                                    onSignOut={signOut}
                                />
                            }
                        >
                            <Route index element={<DashboardPage />} />
                            <Route path="transactions" element={<TransactionsPage />} />
                            <Route path="opening-snapshot" element={<OpeningSnapshotPage />} />
                            <Route path="reporting-periods" element={<ReportingPeriodsPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            )}
        </Authenticator>
    );
}

export default App;