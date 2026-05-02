import { useState } from 'react';
import './App.css';
import { getDbHealth, getHealth } from './lib/api';

function App() {
  const [result, setResult] = useState<string>('No request yet');
  const [loading, setLoading] = useState(false);

  async function testBackend() {
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

  return (
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>ClearBooks Desktop</h1>
        <p>Frontend is running. Test backend connection below.</p>

        <button onClick={testBackend} disabled={loading}>
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>

        <pre style={{ marginTop: '1rem' }}>{result}</pre>
      </main>
  );
}

export default App;