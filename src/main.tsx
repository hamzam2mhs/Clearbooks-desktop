import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureAmplify } from './config/amplify';
import App from './App.tsx';
import './index.css';
import '@aws-amplify/ui-react/styles.css';

configureAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);