type HeaderProps = {
    loginId?: string;
    onSignOut?: () => void;
};

function Header({ loginId, onSignOut }: HeaderProps) {
    return (
        <header className="header">
            <div>
                <p className="eyebrow">Small business bookkeeping</p>
                <h1>ClearBooks</h1>
            </div>

            <div className="header-actions">
                <span className="signed-in">{loginId || 'Signed in'}</span>
                <button className="secondary-button" onClick={onSignOut}>
                    Sign out
                </button>
            </div>
        </header>
    );
}

export default Header;