import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register Service Worker for offline capability on Android, iOS, and desktop in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[SW] App updated, ready to refresh');
    },
    onOfflineReady() {
      console.log('[SW] Wonder World is cached and ready for 100% offline play');
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);

