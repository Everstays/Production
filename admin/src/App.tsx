import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHeader from './components/header/AdminHeader';

const HostDashboard = lazy(() => import('./pages/HostDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('userToken');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading EverStays Admin...</div>}>
        <Routes>
          <Route path="/login" element={<><AdminHeader /><LoginPage /></>} />
          <Route path="/signin" element={<><AdminHeader /><LoginPage /></>} />
          <Route path="/signup" element={<><AdminHeader /><LoginPage /></>} />
          <Route path="/register" element={<><AdminHeader /><LoginPage /></>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
