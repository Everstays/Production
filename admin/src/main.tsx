import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary';

// Prevent unhandled promise rejections from causing white screen
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <Suspense
      fallback={
        <div style={{ padding: 24, color: '#222', background: '#e8d8c3', minHeight: '100vh' }}>
          Loading EverStays Admin...
        </div>
      }
    >
      <App />
    </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
