// перенос сохранения должен выполниться до загрузки хранилища
import './transfer/boot';
import { registerServiceWorker } from './pwa/install';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

if (!import.meta.env.DEV) registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
