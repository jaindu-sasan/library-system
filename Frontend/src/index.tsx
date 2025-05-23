import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';  // Extension removed since allowImportingTsExtensions is true
import reportWebVitals from './reportWebVitals';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();