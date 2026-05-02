import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

type AppLayoutProps = {
    loginId?: string;
    onSignOut?: () => void;
};

function AppLayout({ loginId, onSignOut }: AppLayoutProps) {
    return (
        <div className="app-shell">
            <Sidebar />

            <div className="main-area">
                <Header loginId={loginId} onSignOut={onSignOut} />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;