import { NavLink } from 'react-router-dom';

const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/opening-snapshot', label: 'Opening Snapshot' },
    { to: '/reporting-periods', label: 'Reporting Periods' },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <span className="brand-mark">CB</span>
                <div>
                    <strong>ClearBooks</strong>
                    <small>Desktop</small>
                </div>
            </div>

            <nav className="nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;