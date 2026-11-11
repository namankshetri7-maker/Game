import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { RuntimeErrorBoundary } from './components/RuntimeErrorBoundary';
import { offlineBugFixer } from './services/offlineBugFixer';

// Initialize offline self-healing and bug-fixing shield
offlineBugFixer.initialize();

// Register Service Worker for 100% offline capability on Android, iOS, and desktop
if ('serviceWorker' in navigator) {
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

createRoot(document.getElementById('root')!).render(
  <RuntimeErrorBoundary>
    <App />
  </RuntimeErrorBoundary>
);


