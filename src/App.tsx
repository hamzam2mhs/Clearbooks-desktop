import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { getCurrentBackendUser, getDbHealth, getHealth } from './lib/api';
import './App.css';

function App() {
    const [result, setResult] = useState<string>('No request yet');
    const [loading, setLoading] = useState(false);

    async function testBackendHealth() {
        try {
            setLoading(true);

            const health = await getHealth();
            const dbHealth = await getDbHealth();

            setResult(JSON.stringify({ health, dbHealth }, null, 2));
        } catch (error) {
            setResult(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    async function testAuthenticatedUser() {
        try {
            setLoading(true);

            const user = await getCurrentBackendUser();

            setResult(JSON.stringify(user, null, 2));
        } catch (error) {
            setResult(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Authenticator loginMechanisms={['email']}>
            {({ signOut, user }) => (
                <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
                    <h1>ClearBooks Desktop</h1>

                    <p>
                        Signed in as: <strong>{user?.signInDetails?.loginId}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <button onClick={testBackendHealth} disabled={loading}>
                            Test Backend Health
                        </button>

                        <button onClick={testAuthenticatedUser} disabled={loading}>
                            Test /api/me
                        </button>

                        <button onClick={signOut}>
                            Sign out
                        </button>
                    </div>

                    <pre>{result}</pre>
                </main>
            )}
        </Authenticator>
    );
}

export default App;