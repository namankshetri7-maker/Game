import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { RuntimeErrorBoundary } from './components/RuntimeErrorBoundary';
import { offlineBugFixer } from './services/offlineBugFixer';

// Initialize offline self-healing and bug-fixing shield
offlineBugFixer.initialize();

// Register Service Worker in production builds; clean up any stale dev SW caches during development
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[SW] App updated, ready to refresh');
      },
      onOfflineReady() {
        console.log('[SW] Wonder World is cached and ready for 100% offline play');
      },
    });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      })
      .catch(() => {
        // Ignore if serviceWorker inspection is blocked
      });
  }
}

createRoot(document.getElementById('root')!).render(
  <RuntimeErrorBoundary>
    <App />
  </RuntimeErrorBoundary>
);
